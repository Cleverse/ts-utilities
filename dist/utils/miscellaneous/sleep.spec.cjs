"use strict";


var _chunkSK6IHACFcjs = require('../../chunk-SK6IHACF.cjs');







var _chunkBFR6AXPAcjs = require('../../chunk-BFR6AXPA.cjs');


var _chunk2X3FSA3Bcjs = require('../../chunk-2X3FSA3B.cjs');

// src/utils/miscellaneous/sleep.spec.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
_chunkBFR6AXPAcjs.describe.call(void 0, "miscellaneous/sleep", () => {
  _chunkBFR6AXPAcjs.beforeEach.call(void 0, () => {
    _chunkBFR6AXPAcjs.vi.useFakeTimers();
  });
  _chunkBFR6AXPAcjs.afterEach.call(void 0, () => {
    _chunkBFR6AXPAcjs.vi.useRealTimers();
  });
  _chunkBFR6AXPAcjs.it.call(void 0, "should wait for specified time", async () => {
    const ms = 1e3;
    const promise = _chunkSK6IHACFcjs.sleep.call(void 0, ms);
    const resolved = _chunkBFR6AXPAcjs.vi.fn();
    promise.then(resolved);
    _chunkBFR6AXPAcjs.globalExpect.call(void 0, resolved).not.toHaveBeenCalled();
    await _chunkBFR6AXPAcjs.vi.advanceTimersByTimeAsync(ms);
    _chunkBFR6AXPAcjs.globalExpect.call(void 0, resolved).toHaveBeenCalled();
  });
  _chunkBFR6AXPAcjs.it.call(void 0, "should resolve immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const promise = _chunkSK6IHACFcjs.sleep.call(void 0, 1e3, controller.signal);
    await _chunkBFR6AXPAcjs.globalExpect.call(void 0, promise).resolves.toBeUndefined();
  });
  _chunkBFR6AXPAcjs.it.call(void 0, "should abort sleeping when signal is aborted", async () => {
    const controller = new AbortController();
    const ms = 5e3;
    const promise = _chunkSK6IHACFcjs.sleep.call(void 0, ms, controller.signal);
    await _chunkBFR6AXPAcjs.vi.advanceTimersByTimeAsync(100);
    controller.abort();
    await _chunkBFR6AXPAcjs.globalExpect.call(void 0, promise).resolves.toBeUndefined();
  });
  _chunkBFR6AXPAcjs.it.call(void 0, "should have delay alias", () => {
    _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunkSK6IHACFcjs.delay).toBe(_chunkSK6IHACFcjs.sleep);
  });
});
//# sourceMappingURL=sleep.spec.cjs.map