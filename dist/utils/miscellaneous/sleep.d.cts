/**
 * Sleep for a given number of milliseconds with cancellation support and memory-safe implementation.
 *
 * @param {number} ms time to sleep in milliseconds
 * @param {?AbortSignal} [signal] optional abort signal to cancel the sleep
 */
declare const sleep: (ms: number, signal?: AbortSignal) => Promise<void>;
/**
 * Sleep for a given number of milliseconds with cancellation support and memory-safe implementation.
 *
 * @param {number} ms time to sleep in milliseconds
 * @param {?AbortSignal} [signal] optional abort signal to cancel the sleep
 */
declare const delay: (ms: number, signal?: AbortSignal) => Promise<void>;

export { delay, sleep };
