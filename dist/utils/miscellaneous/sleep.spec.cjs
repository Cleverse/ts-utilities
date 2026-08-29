"use strict";


var _chunkWJXWAYMPcjs = require('../../chunk-WJXWAYMP.cjs');







var _chunkDS2XYV5Gcjs = require('../../chunk-DS2XYV5G.cjs');


var _chunkT6TWWATEcjs = require('../../chunk-T6TWWATE.cjs');

// src/utils/miscellaneous/sleep.spec.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
_chunkDS2XYV5Gcjs.describe.call(void 0, "miscellaneous/sleep", () => {
  _chunkDS2XYV5Gcjs.beforeEach.call(void 0, () => {
    _chunkDS2XYV5Gcjs.vi.useFakeTimers();
  });
  _chunkDS2XYV5Gcjs.afterEach.call(void 0, () => {
    _chunkDS2XYV5Gcjs.vi.useRealTimers();
  });
  _chunkDS2XYV5Gcjs.it.call(void 0, "should wait for specified time", async () => {
    const ms = 1e3;
    const promise = _chunkWJXWAYMPcjs.sleep.call(void 0, ms);
    const resolved = _chunkDS2XYV5Gcjs.vi.fn();
    promise.then(resolved);
    _chunkDS2XYV5Gcjs.globalExpect.call(void 0, resolved).not.toHaveBeenCalled();
    await _chunkDS2XYV5Gcjs.vi.advanceTimersByTimeAsync(ms);
    _chunkDS2XYV5Gcjs.globalExpect.call(void 0, resolved).toHaveBeenCalled();
  });
  _chunkDS2XYV5Gcjs.it.call(void 0, "should resolve immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const promise = _chunkWJXWAYMPcjs.sleep.call(void 0, 1e3, controller.signal);
    await _chunkDS2XYV5Gcjs.globalExpect.call(void 0, promise).resolves.toBeUndefined();
  });
  _chunkDS2XYV5Gcjs.it.call(void 0, "should abort sleeping when signal is aborted", async () => {
    const controller = new AbortController();
    const ms = 5e3;
    const promise = _chunkWJXWAYMPcjs.sleep.call(void 0, ms, controller.signal);
    await _chunkDS2XYV5Gcjs.vi.advanceTimersByTimeAsync(100);
    controller.abort();
    await _chunkDS2XYV5Gcjs.globalExpect.call(void 0, promise).resolves.toBeUndefined();
  });
  _chunkDS2XYV5Gcjs.it.call(void 0, "should have delay alias", () => {
    _chunkDS2XYV5Gcjs.globalExpect.call(void 0, _chunkWJXWAYMPcjs.delay).toBe(_chunkWJXWAYMPcjs.sleep);
  });
});
//# sourceMappingURL=sleep.spec.cjs.map