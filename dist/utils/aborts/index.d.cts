type AbortReason = Error | string | unknown;
interface RaceResult<T> {
    status: "fulfilled" | "aborted";
    value?: T;
    reason?: AbortReason;
}
/**
 * Returns a promise that resolves when signal is aborted
 * Uses node:util.aborted for memory-safe implementation
 */
declare function awaitAbort(signal: AbortSignal, resource?: object): Promise<void>;
/**
 * Returns a promise that rejects when signal is aborted
 */
declare function awaitAbortWithReject(signal: AbortSignal): Promise<never>;
/**
 * Awaits abort or timeout, returning which occurred first
 */
declare function awaitAbortOrTimeout(signal: AbortSignal, timeoutMs: number): Promise<"aborted" | "timeout">;
/**
 * Races an async function against AbortSignal
 * Rejects immediately if signal is aborted during execution and returns the abort reason
 */
declare function withAbortSignal<T>(signal: AbortSignal, asyncFn: () => Promise<T>): Promise<T>;
/**
 * Races an async function against AbortSignal and returns result status
 * Never throws - returns structured result instead
 */
declare function raceWithAbort<T>(signal: AbortSignal, asyncFn: () => Promise<T>): Promise<RaceResult<T>>;
/**
 * Races multiple async functions against AbortSignal
 * Returns when first completes or signal aborts
 */
declare function raceAllWithAbort<T>(signal: AbortSignal, asyncFns: Array<() => Promise<T>>): Promise<T>;
/**
 * Creates a standard AbortError with optional reason
 */
declare function createAbortError(reason?: AbortReason): DOMException;
/**
 * Extracts abort reason from signal, creating AbortError if none exists
 */
declare function getAbortReason(signal: AbortSignal): Error;
declare const Aborts: {
    awaitAbort: typeof awaitAbort;
    awaitAbortWithReject: typeof awaitAbortWithReject;
    awaitAbortOrTimeout: typeof awaitAbortOrTimeout;
    withAbortSignal: typeof withAbortSignal;
    raceWithAbort: typeof raceWithAbort;
    raceAllWithAbort: typeof raceAllWithAbort;
    createAbortError: typeof createAbortError;
    getAbortReason: typeof getAbortReason;
};

export { type AbortReason, Aborts, type RaceResult, awaitAbort, awaitAbortOrTimeout, awaitAbortWithReject, createAbortError, Aborts as default, getAbortReason, raceAllWithAbort, raceWithAbort, withAbortSignal };
