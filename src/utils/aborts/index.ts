import { addAbortListener } from "node:events"
import { aborted } from "node:util"

import { delay } from "../miscellaneous/sleep"

export type AbortReason = Error | string | unknown

export interface RaceResult<T> {
	status: "fulfilled" | "aborted"
	value?: T
	reason?: AbortReason
}

/**
 * Returns a promise that resolves when signal is aborted
 * Uses node:util.aborted for memory-safe implementation
 */
export async function awaitAbort(signal: AbortSignal, resource?: object): Promise<void> {
	if (signal.aborted) {
		return Promise.resolve()
	}
	return aborted(signal, resource ?? {})
}

/**
 * Returns a promise that rejects when signal is aborted
 */
export async function awaitAbortWithReject(signal: AbortSignal): Promise<never> {
	if (signal.aborted) {
		return Promise.reject(getAbortReason(signal))
	}
	return new Promise((_, reject) => {
		const disposable = addAbortListener(signal, () => {
			disposable[Symbol.dispose]()
			reject(getAbortReason(signal))
		})
	})
}

/**
 * Awaits abort or timeout, returning which occurred first
 */
export async function awaitAbortOrTimeout(signal: AbortSignal, timeoutMs: number): Promise<"aborted" | "timeout"> {
	return Promise.race([
		awaitAbort(signal).then(() => "aborted" as const),
		delay(timeoutMs).then(() => "timeout" as const),
	])
}

/**
 * Races an async function against AbortSignal
 * Rejects immediately if signal is aborted during execution and returns the abort reason
 */
export function withAbortSignal<T>(signal: AbortSignal, asyncFn: () => Promise<T>): Promise<T> {
	return new Promise((resolve, reject) => {
		const disposable = addAbortListener(signal, () => {
			disposable[Symbol.dispose]()
			reject(getAbortReason(signal))
		})

		asyncFn()
			.then(resolve)
			.catch(reject)
			.finally(() => disposable[Symbol.dispose]())
	})
}

/**
 * Races an async function against AbortSignal and returns result status
 * Never throws - returns structured result instead
 */
export async function raceWithAbort<T>(signal: AbortSignal, asyncFn: () => Promise<T>): Promise<RaceResult<T>> {
	try {
		const value = await withAbortSignal(signal, asyncFn)
		return { status: "fulfilled", value }
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") {
			return { status: "aborted", reason: error }
		}
		throw error // Re-throw non-abort errors
	}
}

/**
 * Races multiple async functions against AbortSignal
 * Returns when first completes or signal aborts
 */
export function raceAllWithAbort<T>(signal: AbortSignal, asyncFns: Array<() => Promise<T>>): Promise<T> {
	return withAbortSignal(signal, () => Promise.race(asyncFns.map((fn) => fn())))
}

/**
 * Creates a standard AbortError with optional reason
 */
export function createAbortError(reason?: AbortReason): DOMException {
	const message =
		reason instanceof Error ? reason.message : typeof reason === "string" ? reason : "The operation was aborted"
	return new DOMException(message, "AbortError")
}

/**
 * Extracts abort reason from signal, creating AbortError if none exists
 */
export function getAbortReason(signal: AbortSignal): Error {
	if (signal.reason instanceof Error) {
		return signal.reason
	}
	return createAbortError(signal.reason)
}

const Aborts = {
	awaitAbort,
	awaitAbortWithReject,
	awaitAbortOrTimeout,
	withAbortSignal,
	raceWithAbort,
	raceAllWithAbort,
	createAbortError,
	getAbortReason,
}
export { Aborts }
export default Aborts
