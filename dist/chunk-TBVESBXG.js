// src/utils/sync/singleFlight.ts
var SingleFlight = class _SingleFlight {
  static locks = /* @__PURE__ */ new Map();
  /**
   * Executes the provided function with a lock based on the given key.
   * If a request with the same key is already in progress, it returns the promise from that request.
   *
   * @param key - Unique identifier for the request
   * @param fn - Function to execute if no lock exists
   * @returns Promise with the result of the function execution
   */
  static async withLock(key, fn) {
    if (_SingleFlight.locks.has(key)) {
      return _SingleFlight.locks.get(key);
    }
    try {
      const promise = fn();
      _SingleFlight.locks.set(key, promise);
      return await promise;
    } finally {
      _SingleFlight.locks.delete(key);
    }
  }
  /**
   * Removes all locks - useful for testing or forced resets
   */
  static clearAllLocks() {
    _SingleFlight.locks.clear();
  }
  /**
   * Checks if a lock exists for the given key
   *
   * @param key - Unique identifier for the request
   * @returns boolean indicating if a lock exists
   */
  static hasLock(key) {
    return _SingleFlight.locks.has(key);
  }
};

export {
  SingleFlight
};
//# sourceMappingURL=chunk-TBVESBXG.js.map