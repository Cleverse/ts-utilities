/**
 * A cache for in-flight requests to prevent duplicate network calls (singleflight pattern)
 * When multiple identical requests are made concurrently, only the first one will be executed
 * and all others will receive the result from the first request.
 */
declare class SingleFlight {
    private static locks;
    /**
     * Executes the provided function with a lock based on the given key.
     * If a request with the same key is already in progress, it returns the promise from that request.
     *
     * @param key - Unique identifier for the request
     * @param fn - Function to execute if no lock exists
     * @returns Promise with the result of the function execution
     */
    static withLock<T>(key: string, fn: () => Promise<T>): Promise<T>;
    /**
     * Removes all locks - useful for testing or forced resets
     */
    static clearAllLocks(): void;
    /**
     * Checks if a lock exists for the given key
     *
     * @param key - Unique identifier for the request
     * @returns boolean indicating if a lock exists
     */
    static hasLock(key: string): boolean;
}

export { SingleFlight };
