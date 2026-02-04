"use strict";


var _chunkWJXWAYMPcjs = require('../../chunk-WJXWAYMP.cjs');







var _chunk5BHWYHGYcjs = require('../../chunk-5BHWYHGY.cjs');


var _chunkT6TWWATEcjs = require('../../chunk-T6TWWATE.cjs');

// src/utils/miscellaneous/sleep.spec.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
_chunk5BHWYHGYcjs.describe.call(void 0, "miscellaneous/sleep", () => {
  _chunk5BHWYHGYcjs.beforeEach.call(void 0, () => {
    _chunk5BHWYHGYcjs.vi.useFakeTimers();
  });
  _chunk5BHWYHGYcjs.afterEach.call(void 0, () => {
    _chunk5BHWYHGYcjs.vi.useRealTimers();
  });
  _chunk5BHWYHGYcjs.it.call(void 0, "should wait for specified time", async () => {
    const ms = 1e3;
    const promise = _chunkWJXWAYMPcjs.sleep.call(void 0, ms);
    const resolved = _chunk5BHWYHGYcjs.vi.fn();
    promise.then(resolved);
    _chunk5BHWYHGYcjs.globalExpect.call(void 0, resolved).not.toHaveBeenCalled();
    await _chunk5BHWYHGYcjs.vi.advanceTimersByTimeAsync(ms);
    _chunk5BHWYHGYcjs.globalExpect.call(void 0, resolved).toHaveBeenCalled();
  });
  _chunk5BHWYHGYcjs.it.call(void 0, "should resolve immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const promise = _chunkWJXWAYMPcjs.sleep.call(void 0, 1e3, controller.signal);
    await _chunk5BHWYHGYcjs.globalExpect.call(void 0, promise).resolves.toBeUndefined();
  });
  _chunk5BHWYHGYcjs.it.call(void 0, "should abort sleeping when signal is aborted", async () => {
    const controller = new AbortController();
    const ms = 5e3;
    const promise = _chunkWJXWAYMPcjs.sleep.call(void 0, ms, controller.signal);
    await _chunk5BHWYHGYcjs.vi.advanceTimersByTimeAsync(100);
    controller.abort();
    await _chunk5BHWYHGYcjs.globalExpect.call(void 0, promise).resolves.toBeUndefined();
  });
  _chunk5BHWYHGYcjs.it.call(void 0, "should have delay alias", () => {
    _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkWJXWAYMPcjs.delay).toBe(_chunkWJXWAYMPcjs.sleep);
  });
});
//# sourceMappingURL=sleep.spec.cjs.map