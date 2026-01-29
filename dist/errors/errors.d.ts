import VError from 'verror';

interface ErrorOptions {
    cause?: Error | unknown;
    /**
     * HTTP status code
     */
    statusCode?: number;
}
/**
 * CustomError - Base error class for all custom errors.
 */
declare class CustomError extends VError {
    protected statusCode: number;
    constructor(name: string, message: string, options?: ErrorOptions);
}
/**
 * BadRequestError - Error to be thrown when the request is invalid.
 */
declare class BadRequestError extends CustomError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * InternalError - Error to be thrown when an internal server error occurs.
 */
declare class InternalError extends CustomError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * SomethingWentWrong
 */
declare class SomethingWentWrong extends InternalError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * ForbiddenError - Error to be thrown when the user is not allowed to access the resource.
 */
declare class ForbiddenError extends CustomError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * UnauthorizedError - Error to be thrown when the user is not authorized.
 */
declare class UnauthorizedError extends CustomError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * NotFoundError - Error to be thrown when the resource is not found.
 */
declare class NotFoundError extends BadRequestError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * UnsupportedError - Error to be thrown when the request is not supported.
 */
declare class UnsupportedError extends BadRequestError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * InvalidArgumentError - Error to be thrown when an invalid argument is provided.
 */
declare class InvalidArgumentError extends BadRequestError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * TimeoutError - Error to be thrown when a request timeout.
 */
declare class TimeoutError extends CustomError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * RateLimitExceededError - Error to be thrown when a rate limit is exceeded.
 */
declare class RateLimitExceededError extends CustomError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * RecoverableError - Error to be thrown when task can be retried or recovered.
 */
declare class RecoverableError extends CustomError {
    constructor(message: string, options?: ErrorOptions);
}
/**
 * UnrecoverableError - Error to be thrown when task cannot be retried or recovered.
 */
declare class UnrecoverableError extends CustomError {
    constructor(message: string, options?: ErrorOptions);
}
/**
 * ConflictError - Error to be thrown when a request conflict with the current state of the target resource.
 */
declare class ConflictError extends CustomError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * SkipableError - Error to be thrown when the error is skipable and can be ignored.
 */
declare class SkipableError extends CustomError {
    constructor(message?: string, options?: ErrorOptions);
}

export { BadRequestError, ConflictError, CustomError, ForbiddenError, InternalError, InvalidArgumentError, NotFoundError, RateLimitExceededError, RecoverableError, SkipableError, SomethingWentWrong, TimeoutError, UnauthorizedError, UnrecoverableError, UnsupportedError };
