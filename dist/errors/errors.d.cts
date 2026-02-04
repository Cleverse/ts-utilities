import VError from 'verror';
import { Primitive } from '../types/Utility/primitive.cjs';

interface ErrorOptions {
    cause?: Error | unknown;
    /**
     * HTTP status code
     */
    statusCode?: number;
    /**
     * Public Info - key-value pairs that are safe to display to the user.
     */
    publicInfo?: Record<string, Primitive>;
    /**
     * Info - key-value pairs that are not safe to display to the user.
     */
    info?: Record<string, Primitive>;
}
/**
 * CustomError - Base error class for all custom errors.
 */
declare class CustomError extends VError {
    readonly statusCode: number;
    readonly publicInfo: Record<string, Primitive>;
    constructor(name: string, message: string, options?: ErrorOptions);
    /**
     * is4xxError - Check if the error is a 4xx client error.
     */
    static is4xxError(error: Error): error is ClientError | CustomError;
    /**
     * is5xxError - Check if the error is a 5xx server error.
     */
    static is5xxError(error: Error): error is ServerError | CustomError;
    static publicInfo(error: Error): Record<string, Primitive>;
    static info(error: Error | unknown): Record<string, Primitive>;
    static cause(error: Error | unknown): Error | null;
}
/**
 * ClientError - Base error class for all 4xx client errors.
 */
declare class ClientError extends CustomError {
    constructor(name: string, message: string, options?: ErrorOptions);
}
/**
 * ServerError - Base error class for all 5xx server errors.
 */
declare class ServerError extends CustomError {
    constructor(name: string, message: string, options?: ErrorOptions);
}
/**
 * BadRequestError - Error to be thrown when the request is invalid.
 */
declare class BadRequestError extends ClientError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * InternalError - Error to be thrown when an internal server error occurs.
 * Most of cases is our fault (logical error, bug, unexpected error -> if error it's mean we missed something).
 */
declare class InternalError extends ServerError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * SomethingWentWrong - Error to be thrown when an unknown error occurs (not sure what's the exact error).
 * May be our fault, user fault or external service fault.
 */
declare class SomethingWentWrong extends InternalError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * ForbiddenError - Error to be thrown when the user is not allowed to access the resource.
 */
declare class ForbiddenError extends ClientError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * UnauthorizedError - Error to be thrown when the user is not authorized.
 */
declare class UnauthorizedError extends ClientError {
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
declare class TimeoutError extends ClientError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * RateLimitExceededError - Error to be thrown when a rate limit is exceeded.
 */
declare class RateLimitExceededError extends ClientError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * RecoverableError - Error to be thrown when task can be retried or recovered.
 */
declare class RecoverableError extends ServerError {
    constructor(message: string, options?: ErrorOptions);
}
/**
 * UnrecoverableError - Error to be thrown when task cannot be retried or recovered.
 */
declare class UnrecoverableError extends ServerError {
    constructor(message: string, options?: ErrorOptions);
}
/**
 * ConflictError - Error to be thrown when a request conflict with the current state of the target resource.
 */
declare class ConflictError extends ClientError {
    constructor(message?: string, options?: ErrorOptions);
}
/**
 * SkipableError - Error to be thrown when the error is skipable and can be ignored.
 */
declare class SkipableError extends ServerError {
    constructor(message?: string, options?: ErrorOptions);
}

export { BadRequestError, ClientError, ConflictError, CustomError, ForbiddenError, InternalError, InvalidArgumentError, NotFoundError, RateLimitExceededError, RecoverableError, ServerError, SkipableError, SomethingWentWrong, TimeoutError, UnauthorizedError, UnrecoverableError, UnsupportedError };
