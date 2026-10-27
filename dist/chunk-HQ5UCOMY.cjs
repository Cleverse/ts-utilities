"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } var _class;

var _chunk2X3FSA3Bcjs = require('./chunk-2X3FSA3B.cjs');

// src/utils/sync/mutexWithKey.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var _asyncmutex = require('async-mutex');
var MutexWithKey = (_class = class {
  static __initStatic() {this.locks = /* @__PURE__ */ new Map()}
  static __initStatic2() {this.creationMutex = new (0, _asyncmutex.Mutex)()}
  static async withLock(key, fn) {
    let mutex;
    await this.creationMutex.runExclusive(() => {
      mutex = _nullishCoalesce(this.locks.get(key), () => ( new (0, _asyncmutex.Mutex)()));
      this.locks.set(key, mutex);
    });
    return mutex.runExclusive(fn);
  }
}, _class.__initStatic(), _class.__initStatic2(), _class);



exports.MutexWithKey = MutexWithKey;
//# sourceMappingURL=chunk-HQ5UCOMY.cjs.map