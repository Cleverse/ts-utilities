import VError from "verror"

import { errors } from "../utils/errors"

interface ErrorOptions {
	cause?: Error | unknown

	/**
	 * HTTP status code
	 */
	statusCode?: number
}

/**
 * CustomError - Base error class for all custom errors.
 */
export class CustomError extends VError {
	protected statusCode: number
	constructor(name: string, message: string, options?: ErrorOptions) {
		super(
			{
				name,
				cause: options?.cause ? errors.toError(options.cause) : undefined,
			},
			message,
		)
		this.statusCode = options?.statusCode ?? 500
	}
}

/**
 * BadRequestError - Error to be thrown when the request is invalid.
 */
export class BadRequestError extends CustomError {
	constructor(message: string = "Bad Request", options?: ErrorOptions) {
		super("BadRequestError", message, { statusCode: 400, ...options })
	}
}

/**
 * InternalError - Error to be thrown when an internal server error occurs.
 */
export class InternalError extends CustomError {
	constructor(message: string = "Internal Server Error", options?: ErrorOptions) {
		super("InternalError", message, { statusCode: 500, ...options })
	}
}

/**
 * SomethingWentWrong
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
export class ForbiddenError extends CustomError {
	constructor(message: string = "Forbidden", options?: ErrorOptions) {
		super("ForbiddenError", message, { statusCode: 403, ...options })
	}
}

/**
 * UnauthorizedError - Error to be thrown when the user is not authorized.
 */
export class UnauthorizedError extends CustomError {
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
export class TimeoutError extends CustomError {
	constructor(message: string = "Timeout", options?: ErrorOptions) {
		super("TimeoutError", message, { statusCode: 408, ...options })
	}
}

/**
 * RateLimitExceededError - Error to be thrown when a rate limit is exceeded.
 */
export class RateLimitExceededError extends CustomError {
	constructor(message: string = "Rate Limit Exceeded", options?: ErrorOptions) {
		super("RateLimitExceededError", message, { statusCode: 429, ...options })
	}
}

/**
 * RecoverableError - Error to be thrown when task can be retried or recovered.
 */
export class RecoverableError extends CustomError {
	constructor(message: string, options?: ErrorOptions) {
		super("RecoverableError", message, { statusCode: 500, ...options })
	}
}

/**
 * UnrecoverableError - Error to be thrown when task cannot be retried or recovered.
 */
export class UnrecoverableError extends CustomError {
	constructor(message: string, options?: ErrorOptions) {
		super("UnrecoverableError", message, { statusCode: 500, ...options })
	}
}

/**
 * ConflictError - Error to be thrown when a request conflict with the current state of the target resource.
 */
export class ConflictError extends CustomError {
	constructor(message: string = "Conflict", options?: ErrorOptions) {
		super("ConflictError", message, { statusCode: 409, ...options })
	}
}

/**
 * SkipableError - Error to be thrown when the error is skipable and can be ignored.
 */
export class SkipableError extends CustomError {
	constructor(message: string = "skippable", options?: ErrorOptions) {
		super("SkipableError", message, { statusCode: 500, ...options })
	}
}
