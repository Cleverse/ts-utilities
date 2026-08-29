import { WrapOptions } from 'retry';

declare class AbortError extends Error {
    originalError: Error;
    constructor(message: string | Error);
}
interface RetryOptions extends WrapOptions {
    onFailedAttempt?: (error: RetryError) => Promise<void> | void;
    shouldRetry?: (error: RetryError) => Promise<boolean> | boolean;
}
interface RetryError extends Error {
    attemptNumber?: number;
    retriesLeft?: number;
}
declare function retry<T>(input: (attemptNumber: number) => Promise<T>, options: RetryOptions): Promise<T>;

export { AbortError, type RetryOptions, retry as default, retry };
