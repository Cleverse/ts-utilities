/**
 * A cache for in-flight requests to prevent duplicate network calls (singleflight pattern)
 * When multiple identical requests are made concurrently, only the first one will be executed
 * and all others will receive the result from the first request.
 */
export class SingleFlight {
	private static locks = new Map<string, Promise<unknown>>()

	/**
	 * Executes the provided function with a lock based on the given key.
	 * If a request with the same key is already in progress, it returns the promise from that request.
	 *
	 * @param key - Unique identifier for the request
	 * @param fn - Function to execute if no lock exists
	 * @returns Promise with the result of the function execution
	 */
	static async withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
		// If there's already a request in flight with this key, return its promise
		if (SingleFlight.locks.has(key)) {
			return SingleFlight.locks.get(key) as Promise<T>
		}

		try {
			// Store the promise in the locks object
			const promise = fn()
			SingleFlight.locks.set(key, promise)
			return await promise
		} finally {
			SingleFlight.locks.delete(key)
		}
	}

	/**
	 * Removes all locks - useful for testing or forced resets
	 */
	static clearAllLocks(): void {
		SingleFlight.locks.clear()
	}

	/**
	 * Checks if a lock exists for the given key
	 *
	 * @param key - Unique identifier for the request
	 * @returns boolean indicating if a lock exists
	 */
	static hasLock(key: string): boolean {
		return SingleFlight.locks.has(key)
	}
}
