// src/utils/sync/mutexWithKey.ts
import { Mutex } from "async-mutex";
var MutexWithKey = class {
  static locks = /* @__PURE__ */ new Map();
  static creationMutex = new Mutex();
  static async withLock(key, fn) {
    let mutex;
    await this.creationMutex.runExclusive(() => {
      mutex = this.locks.get(key) ?? new Mutex();
      this.locks.set(key, mutex);
    });
    return mutex.runExclusive(fn);
  }
};

export {
  MutexWithKey
};
//# sourceMappingURL=chunk-2U6RGUPV.js.map