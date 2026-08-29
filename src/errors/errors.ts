import VError from "verror"

import type { Primitive } from "@/types"

import { errors } from "../utils/errors"

interface ErrorOptions {
	cause?: Error | unknown

	/**
	 * HTTP status code
	 */
	statusCode?: number

	/**
	 * Public Info - key-value pairs that are safe to display to the user.
	 */
	publicInfo?: Record<string, Primitive>

	/**
	 * Info - key-value pairs that are not safe to display to the user.
	 */
	info?: Record<string, Primitive>
}

/**
 * CustomError - Base error class for all custom errors.
 */
export class CustomError extends VError {
	public readonly statusCode: number
	public readonly publicInfo: Record<string, Primitive>
	constructor(name: string, message: string, options?: ErrorOptions) {
		super(
			{
				name,
				cause: options?.cause ? errors.toError(options.cause) : undefined,
				info: options?.info ?? {},
			},
			message,
		)
		this.statusCode = options?.statusCode ?? 500
		this.publicInfo = options?.publicInfo ?? {}
	}

	/**
	 * is4xxError - Check if the error is a 4xx client error.
	 */
	static is4xxError(error: Error): error is ClientError | CustomError {
		return (
			error instanceof ClientError ||
			(error instanceof CustomError && error.statusCode >= 400 && error.statusCode < 500)
		)
	}

	/**
	 * is5xxError - Check if the error is a 5xx server error.
	 */
	static is5xxError(error: Error): error is ServerError | CustomError {
		return error instanceof ServerError || (error instanceof CustomError && error.statusCode >= 500)
	}

	static publicInfo(error: Error): Record<string, Primitive> {
		return error instanceof CustomError ? error.publicInfo : {}
	}

	static info(error: Error | unknown): Record<string, Primitive> {
		return VError.info(errors.toError(error)) ?? {}
	}

	static cause(error: Error | unknown): Error | null {
		return errors.unwrap(error) ?? null
	}
}

/**
 * ClientError - Base error class for all 4xx client errors.
 */
export class ClientError extends CustomError {
	constructor(name: string, message: string, options?: ErrorOptions) {
		super(name, message, options)
	}
}

/**
 * ServerError - Base error class for all 5xx server errors.
 */
export class ServerError extends CustomError {
	constructor(name: string, message: string, options?: ErrorOptions) {
		super(name, message, options)
	}
}

/**
 * BadRequestError - Error to be thrown when the request is invalid.
 */
export class BadRequestError extends ClientError {
	constructor(message: string = "Bad Request", options?: ErrorOptions) {
		super("BadRequestError", message, { statusCode: 400, ...options })
	}
}

/**
 * InternalError - Error to be thrown when an internal server error occurs.
 * Most of cases is our fault (logical error, bug, unexpected error -> if error it's mean we missed something).
 */
export class InternalError extends ServerError {
	constructor(message: string = "Internal Server Error", options?: ErrorOptions) {
		super("InternalError", message, { statusCode: 500, ...options })
	}
}

/**
 * SomethingWentWrong - Error to be thrown when an unknown error occurs (not sure what's the exact error).
 * May be our fault, user fault or external service fault.
 */
export class SomethingWentWrong extends InternalError {
	constructor(message: string = "Something Went Wrong", options?: ErrorOptions) {
		super(message, { statusCode: 500, ...options })
		this.name = "SomethingWentWrong"
	}
}

/**
 * ForbiddenError - Error to be thrown when the user is not allowed to access the resource.
 */
export class ForbiddenError extends ClientError {
	constructor(message: string = "Forbidden", options?: ErrorOptions) {
		super("ForbiddenError", message, { statusCode: 403, ...options })
	}
}

/**
 * UnauthorizedError - Error to be thrown when the user is not authorized.
 */
export class UnauthorizedError extends ClientError {
	constructor(message: string = "Unauthorized", options?: ErrorOptions) {
		super("UnauthorizedError", message, { statusCode: 401, ...options })
	}
}

/**
 * NotFoundError - Error to be thrown when the resource is not found.
 */
export class NotFoundError extends BadRequestError {
	constructor(message: string = "Not Found", options?: ErrorOptions) {
		super(message, { statusCode: 404, ...options })
		this.name = "NotFoundError"
	}
}

/**
 * UnsupportedError - Error to be thrown when the request is not supported.
 */
export class UnsupportedError extends BadRequestError {
	constructor(message: string = "Unsupported", options?: ErrorOptions) {
		super(message, options)
		this.name = "UnsupportedError"
	}
}

/**
 * InvalidArgumentError - Error to be thrown when an invalid argument is provided.
 */
export class InvalidArgumentError extends BadRequestError {
	constructor(message: string = "Invalid Argument", options?: ErrorOptions) {
		super(message, options)
		this.name = "InvalidArgumentError"
	}
}

/**
 * TimeoutError - Error to be thrown when a request timeout.
 */
export class TimeoutError extends ClientError {
	constructor(message: string = "Timeout", options?: ErrorOptions) {
		super("TimeoutError", message, { statusCode: 408, ...options })
	}
}

/**
 * RateLimitExceededError - Error to be thrown when a rate limit is exceeded.
 */
export class RateLimitExceededError extends ClientError {
	constructor(message: string = "Rate Limit Exceeded", options?: ErrorOptions) {
		super("RateLimitExceededError", message, { statusCode: 429, ...options })
	}
}

/**
 * RecoverableError - Error to be thrown when task can be retried or recovered.
 */
export class RecoverableError extends ServerError {
	constructor(message: string, options?: ErrorOptions) {
		super("RecoverableError", message, { statusCode: 500, ...options })
	}
}

/**
 * UnrecoverableError - Error to be thrown when task cannot be retried or recovered.
 */
export class UnrecoverableError extends ServerError {
	constructor(message: string, options?: ErrorOptions) {
		super("UnrecoverableError", message, { statusCode: 500, ...options })
	}
}

/**
 * ConflictError - Error to be thrown when a request conflict with the current state of the target resource.
 */
export class ConflictError extends ClientError {
	constructor(message: string = "Conflict", options?: ErrorOptions) {
		super("ConflictError", message, { statusCode: 409, ...options })
	}
}

/**
 * SkipableError - Error to be thrown when the error is skipable and can be ignored.
 */
export class SkipableError extends ServerError {
	constructor(message: string = "skippable", options?: ErrorOptions) {
		super("SkipableError", message, { statusCode: 500, ...options })
	}
}
