"use strict";


var _chunkP6NRJGVXcjs = require('../../chunk-P6NRJGVX.cjs');







var _chunkXDMBOPPTcjs = require('../../chunk-XDMBOPPT.cjs');


var _chunk5JHPDOVLcjs = require('../../chunk-5JHPDOVL.cjs');

// src/utils/miscellaneous/sleep.spec.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
_chunkXDMBOPPTcjs.describe.call(void 0, "miscellaneous/sleep", () => {
  _chunkXDMBOPPTcjs.beforeEach.call(void 0, () => {
    _chunkXDMBOPPTcjs.vi.useFakeTimers();
  });
  _chunkXDMBOPPTcjs.afterEach.call(void 0, () => {
    _chunkXDMBOPPTcjs.vi.useRealTimers();
  });
  _chunkXDMBOPPTcjs.it.call(void 0, "should wait for specified time", async () => {
    const ms = 1e3;
    const promise = _chunkP6NRJGVXcjs.sleep.call(void 0, ms);
    const resolved = _chunkXDMBOPPTcjs.vi.fn();
    promise.then(resolved);
    _chunkXDMBOPPTcjs.globalExpect.call(void 0, resolved).not.toHaveBeenCalled();
    await _chunkXDMBOPPTcjs.vi.advanceTimersByTimeAsync(ms);
    _chunkXDMBOPPTcjs.globalExpect.call(void 0, resolved).toHaveBeenCalled();
  });
  _chunkXDMBOPPTcjs.it.call(void 0, "should resolve immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const promise = _chunkP6NRJGVXcjs.sleep.call(void 0, 1e3, controller.signal);
    await _chunkXDMBOPPTcjs.globalExpect.call(void 0, promise).resolves.toBeUndefined();
  });
  _chunkXDMBOPPTcjs.it.call(void 0, "should abort sleeping when signal is aborted", async () => {
    const controller = new AbortController();
    const ms = 5e3;
    const promise = _chunkP6NRJGVXcjs.sleep.call(void 0, ms, controller.signal);
    await _chunkXDMBOPPTcjs.vi.advanceTimersByTimeAsync(100);
    controller.abort();
    await _chunkXDMBOPPTcjs.globalExpect.call(void 0, promise).resolves.toBeUndefined();
  });
  _chunkXDMBOPPTcjs.it.call(void 0, "should have delay alias", () => {
    _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkP6NRJGVXcjs.delay).toBe(_chunkP6NRJGVXcjs.sleep);
  });
});
//# sourceMappingURL=sleep.spec.cjs.map