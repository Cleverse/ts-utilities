/* eslint-disable @typescript-eslint/no-unused-expressions */
// Ref: https://www.npmjs.com/package/p-retry
import { operation as retryOperation } from "retry"

import type { WrapOptions, RetryOperation } from "retry"

export class AbortError extends Error {
	originalError: Error

	constructor(message: string | Error) {
		super()

		if (message instanceof Error) {
			this.originalError = message
			;({ message } = message)
		} else {
			this.originalError = new Error(message)
			this.originalError.stack = this.stack
		}

		this.name = "AbortError"
		this.message = message
	}
}

export interface RetryOptions extends WrapOptions {
	onFailedAttempt?: (error: RetryError) => Promise<void> | void
	shouldRetry?: (error: RetryError) => Promise<boolean> | boolean
}

interface RetryError extends Error {
	attemptNumber?: number
	retriesLeft?: number
}

const decorateErrorWithCounts = (error: RetryError, attemptNumber: number, options: RetryOptions): RetryError => {
	// Minus 1 from attemptNumber because the first attempt does not count as a retry
	const retriesLeft = (options.retries ?? 10) - (attemptNumber - 1)

	error.attemptNumber = attemptNumber
	error.retriesLeft = retriesLeft
	return error
}

export async function retry<T>(input: (attemptNumber: number) => Promise<T>, options: RetryOptions): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		options = { ...options }
		options.onFailedAttempt ??= () => {}
		options.shouldRetry ??= () => true
		options.retries ??= 10

		const operation: RetryOperation = retryOperation(options)

		const cleanUp = () => {
			operation.stop()
		}

		operation.attempt(async (attemptNumber: number) => {
			try {
				const result = await input(attemptNumber)
				cleanUp()
				resolve(result)
			} catch (error) {
				try {
					if (!(error instanceof Error)) {
						throw new TypeError(`Non-error was thrown: "${error}". You should only throw errors.`)
					}

					if (error instanceof AbortError) {
						throw error.originalError
					}

					decorateErrorWithCounts(error, attemptNumber, options)

					if (options.shouldRetry && !(await options.shouldRetry(error))) {
						operation.stop()
						reject(error)
					}

					options.onFailedAttempt && (await options.onFailedAttempt(error))

					if (!operation.retry(error)) {
						throw operation.mainError()
					}
				} catch (finalError) {
					decorateErrorWithCounts(finalError as RetryError, attemptNumber, options)
					cleanUp()
					reject(finalError)
				}
			}
		})
	})
}

export default retry
