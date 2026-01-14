"use strict";Object.defineProperty(exports, "__esModule", {value: true}); var _class;

var _chunk5JHPDOVLcjs = require('./chunk-5JHPDOVL.cjs');

// src/utils/sync/singleFlight.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
var SingleFlight = (_class = class _SingleFlight {
  static __initStatic() {this.locks = /* @__PURE__ */ new Map()}
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
}, _class.__initStatic(), _class);



exports.SingleFlight = SingleFlight;
//# sourceMappingURL=chunk-4YCXTTUU.cjs.map