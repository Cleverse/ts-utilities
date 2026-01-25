"use strict";

var _chunkP6LVEPTDcjs = require('../../chunk-P6LVEPTD.cjs');
require('../../chunk-WJXWAYMP.cjs');







var _chunk5BHWYHGYcjs = require('../../chunk-5BHWYHGY.cjs');


var _chunkT6TWWATEcjs = require('../../chunk-T6TWWATE.cjs');

// src/utils/aborts/index.spec.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
_chunk5BHWYHGYcjs.describe.call(void 0, "aborts", () => {
  _chunk5BHWYHGYcjs.beforeEach.call(void 0, () => {
    _chunk5BHWYHGYcjs.vi.useFakeTimers();
  });
  _chunk5BHWYHGYcjs.afterEach.call(void 0, () => {
    _chunk5BHWYHGYcjs.vi.useRealTimers();
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "awaitAbort", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should resolve when signal is aborted", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 100);
      const promise = _chunkP6LVEPTDcjs.Aborts.awaitAbort(controller.signal);
      const resolved = _chunk5BHWYHGYcjs.vi.fn();
      promise.then(resolved);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, resolved).not.toHaveBeenCalled();
      await _chunk5BHWYHGYcjs.vi.advanceTimersByTimeAsync(100);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, resolved).toHaveBeenCalled();
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should resolve immediately if already aborted", async () => {
      const controller = new AbortController();
      controller.abort();
      const promise = _chunkP6LVEPTDcjs.Aborts.awaitAbort(controller.signal);
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, promise).resolves.toBeUndefined();
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "awaitAbortWithReject", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should reject when signal is aborted", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new Error("aborted")), 100);
      const promise = _chunkP6LVEPTDcjs.Aborts.awaitAbortWithReject(controller.signal);
      const catchFn = _chunk5BHWYHGYcjs.vi.fn();
      promise.catch(catchFn);
      await _chunk5BHWYHGYcjs.vi.advanceTimersByTimeAsync(100);
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, promise).rejects.toThrow("aborted");
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should reject immediately if already aborted", async () => {
      const controller = new AbortController();
      controller.abort(new Error("aborted"));
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkP6LVEPTDcjs.Aborts.awaitAbortWithReject(controller.signal)).rejects.toThrow("aborted");
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "awaitAbortOrTimeout", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should return timeout if time passes first", async () => {
      const controller = new AbortController();
      const promise = _chunkP6LVEPTDcjs.Aborts.awaitAbortOrTimeout(controller.signal, 100);
      await _chunk5BHWYHGYcjs.vi.advanceTimersByTimeAsync(100);
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, promise).resolves.toBe("timeout");
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should return aborted if signal aborts first", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 50);
      const promise = _chunkP6LVEPTDcjs.Aborts.awaitAbortOrTimeout(controller.signal, 100);
      await _chunk5BHWYHGYcjs.vi.advanceTimersByTimeAsync(50);
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, promise).resolves.toBe("aborted");
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "raceWithAbort", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should return fulfilled status with value", async () => {
      const controller = new AbortController();
      const result = await _chunkP6LVEPTDcjs.Aborts.raceWithAbort(controller.signal, async () => "success");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result).toEqual({ status: "fulfilled", value: "success" });
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should return aborted status with reason", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 10);
      const promise = _chunkP6LVEPTDcjs.Aborts.raceWithAbort(controller.signal, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return "should not reach here";
      });
      await _chunk5BHWYHGYcjs.vi.advanceTimersByTimeAsync(10);
      const result = await promise;
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.status).toBe("aborted");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.reason).toBeInstanceOf(DOMException);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.reason.name).toBe("AbortError");
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should throw non-abort errors", async () => {
      const controller = new AbortController();
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, 
        _chunkP6LVEPTDcjs.Aborts.raceWithAbort(controller.signal, async () => {
          throw new Error("fail");
        })
      ).rejects.toThrow("fail");
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "withAbortSignal", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should reject with abort reason if aborted during execution", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new Error("cancelled")), 10);
      const promise = _chunkP6LVEPTDcjs.Aborts.withAbortSignal(controller.signal, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
      const catchFn = _chunk5BHWYHGYcjs.vi.fn();
      promise.catch(catchFn);
      await _chunk5BHWYHGYcjs.vi.advanceTimersByTimeAsync(10);
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, promise).rejects.toThrow("cancelled");
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "raceAllWithAbort", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should resolve with first completed promise", async () => {
      const controller = new AbortController();
      const promise = _chunkP6LVEPTDcjs.Aborts.raceAllWithAbort(controller.signal, [
        async () => {
          await new Promise((r) => setTimeout(r, 50));
          return 1;
        },
        async () => {
          await new Promise((r) => setTimeout(r, 10));
          return 2;
        }
      ]);
      await _chunk5BHWYHGYcjs.vi.advanceTimersByTimeAsync(10);
      await _chunk5BHWYHGYcjs.globalExpect.call(void 0, promise).resolves.toBe(2);
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map