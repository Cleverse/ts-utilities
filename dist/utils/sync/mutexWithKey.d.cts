/**
 * Provides per-key mutual exclusion using async-mutex.
 * This only works on a single thread.
 */
declare class MutexWithKey {
    private static locks;
    private static creationMutex;
    static withLock<T>(key: string, fn: () => Promise<T>): Promise<T>;
}

export { MutexWithKey };
