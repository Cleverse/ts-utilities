/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { VError } from "verror"

function unwrap(err: Error | unknown): Error | undefined {
	if (!err || typeof err !== "object" || !("cause" in err)) return undefined

	// VError / NError style causes
	if (typeof err.cause === "function") {
		const causeResult = err.cause()
		return causeResult instanceof Error ? causeResult : undefined
	} else {
		return err.cause instanceof Error ? err.cause : undefined
	}
}

/**
 * Finding an error of a specific type within the cause chain.
 */
function findCause<T extends Error>(err: Error | unknown, reference: new (...args: any[]) => T): T | undefined {
	if (!(err instanceof Error)) return
	if (!err || !reference) return
	if (
		!(reference.prototype instanceof Error) &&
		// @ts-ignore
		reference !== Error
	) {
		return
	}

	// Ensures we don't go circular
	const seen = new Set<Error>()

	let _err: Error | undefined | null = err
	while (_err && !seen.has(_err)) {
		seen.add(_err)
		if (_err instanceof reference) {
			return _err
		}

		// VError.MultiError causes
		if (_err instanceof VError.MultiError) {
			for (const err of _err.errors()) {
				const result = findCause(err, reference)
				if (result) {
					return result
				}
			}
		} else {
			_err = unwrap(_err)
		}
	}
	return
}

/**
 * Golang-like errors utilities.
 */
export class errors {
	/**
	 * Finding an error of a specific type within the cause chain.
	 *
	 * Support normal error cause (ES2021+) and VError/NError style causes
	 */
	static find<T extends Error>(err: Error | unknown, reference: new (...args: any[]) => T): T | undefined {
		return findCause(err, reference)
	}

	/**
	 * Finding an wrapped error is a match of the reference error.
	 * It's like `errors.Is` in Golang.
	 *
	 * Support normal error cause (ES2021+) and VError/NError style causes
	 *
	 * @example
	 * ```ts
	 * try {
	 *   await someRecoverableTask().catch((err) => {
	 *     throw new Error("failed to do something", { cause: err })
	 *   })
	 * } catch (err: unknown) {
	 *   // `true`
	 *   if (errors.is(err, Error)){
	 *     console.error(err.message) // auto type inference to `Error`
	 *   }
	 *
	 *   // `true` supports to check chain of errors cause
	 *   if (errors.is(err, RecoverableError)){
	 *     console.error(err.message) // auto type inference to `Error`
	 *   }
	 * }
	 * ```
	 */
	static is<T extends Error>(err: Error | unknown, reference: new (...args: any[]) => T): err is Error {
		return findCause(err, reference) !== undefined
	}

	/**
	 * Checking and casting an error to a specific type.
	 * It's like `errors.As` in Golang.
	 *
	 * @example
	 * ```ts
	 * try {
	 *   await someRecoverableTask().catch((err) => {
	 *     throw new HTTPError(401, "failed to do something")
	 *   })
	 * } catch (err: unknown) {
	 *   // `true`
	 *   if (errors.as(err, HTTPError)){
	 *     console.error(err.code) // type inference to `HTTPError`
	 *   }
	 *
	 *   // `true` because `HTTPError` is inherited from `Error`
	 *   if (errors.as(err, Error)){
	 *     console.error(err.message) // type inference to `Error`
	 *   }
	 * }
	 * ```
	 */
	static as<T extends Error>(err: Error | unknown, reference: new (...args: any[]) => T): err is T {
		return err instanceof reference
	}

	/**
	 * Unwrapping the error cause.
	 *
	 * Support normal error cause (ES2021+) and VError/NError style causes
	 */
	static unwrap(err: Error | unknown): Error | undefined {
		if (!(err instanceof Error)) return undefined
		return unwrap(err)
	}

	/**
	 * Joining multiple errors.
	 */
	static join(errs: Error[]): Error | null {
		return VError.errorFromList(errs)
	}

	static toError(err: unknown): Error {
		if (err instanceof Error) return err
		if (!err) return new Error("Unknown error")
		return new Error(String(err))
	}
}

export default errors
