import { addAbortListener } from "node:events"

/**
 * Sleep for a given number of milliseconds with cancellation support and memory-safe implementation.
 *
 * @param {number} ms time to sleep in milliseconds
 * @param {?AbortSignal} [signal] optional abort signal to cancel the sleep
 */
export const sleep = (ms: number, signal?: AbortSignal): Promise<void> => {
	if (signal?.aborted) {
		return Promise.resolve()
	}
	return new Promise<void>((resolve) => {
		const timer = setTimeout(resolve, ms)
		if (signal) {
			const disposable = addAbortListener(signal, () => {
				clearTimeout(timer)
				disposable[Symbol.dispose]()
				resolve()
			})
		}
	})
}

/**
 * Sleep for a given number of milliseconds with cancellation support and memory-safe implementation.
 *
 * @param {number} ms time to sleep in milliseconds
 * @param {?AbortSignal} [signal] optional abort signal to cancel the sleep
 */
export const delay = sleep
