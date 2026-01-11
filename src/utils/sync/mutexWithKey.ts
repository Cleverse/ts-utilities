import { Mutex } from "async-mutex"

/**
 * Provides per-key mutual exclusion using async-mutex.
 * This only works on a single thread.
 */
export class MutexWithKey {
	private static locks = new Map<string, Mutex>()
	private static creationMutex = new Mutex()

	static async withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
		let mutex: Mutex

		// Ensure only one mutex is created per key
		await this.creationMutex.runExclusive(() => {
			mutex = this.locks.get(key) ?? new Mutex()
			this.locks.set(key, mutex)
		})

		// Run the actual function under the per-key mutex
		return mutex!.runExclusive(fn)
	}
}
