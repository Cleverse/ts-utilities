"use strict";

var _chunkDX72RHXIcjs = require('../../chunk-DX72RHXI.cjs');
require('../../chunk-SK6IHACF.cjs');







var _chunkBFR6AXPAcjs = require('../../chunk-BFR6AXPA.cjs');


var _chunk2X3FSA3Bcjs = require('../../chunk-2X3FSA3B.cjs');

// src/utils/aborts/index.spec.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
_chunkBFR6AXPAcjs.describe.call(void 0, "aborts", () => {
  _chunkBFR6AXPAcjs.beforeEach.call(void 0, () => {
    _chunkBFR6AXPAcjs.vi.useFakeTimers();
  });
  _chunkBFR6AXPAcjs.afterEach.call(void 0, () => {
    _chunkBFR6AXPAcjs.vi.useRealTimers();
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "awaitAbort", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should resolve when signal is aborted", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 100);
      const promise = _chunkDX72RHXIcjs.Aborts.awaitAbort(controller.signal);
      const resolved = _chunkBFR6AXPAcjs.vi.fn();
      promise.then(resolved);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, resolved).not.toHaveBeenCalled();
      await _chunkBFR6AXPAcjs.vi.advanceTimersByTimeAsync(100);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, resolved).toHaveBeenCalled();
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should resolve immediately if already aborted", async () => {
      const controller = new AbortController();
      controller.abort();
      const promise = _chunkDX72RHXIcjs.Aborts.awaitAbort(controller.signal);
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, promise).resolves.toBeUndefined();
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "awaitAbortWithReject", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should reject when signal is aborted", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new Error("aborted")), 100);
      const promise = _chunkDX72RHXIcjs.Aborts.awaitAbortWithReject(controller.signal);
      const catchFn = _chunkBFR6AXPAcjs.vi.fn();
      promise.catch(catchFn);
      await _chunkBFR6AXPAcjs.vi.advanceTimersByTimeAsync(100);
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, promise).rejects.toThrow("aborted");
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should reject immediately if already aborted", async () => {
      const controller = new AbortController();
      controller.abort(new Error("aborted"));
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunkDX72RHXIcjs.Aborts.awaitAbortWithReject(controller.signal)).rejects.toThrow("aborted");
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "awaitAbortOrTimeout", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should return timeout if time passes first", async () => {
      const controller = new AbortController();
      const promise = _chunkDX72RHXIcjs.Aborts.awaitAbortOrTimeout(controller.signal, 100);
      await _chunkBFR6AXPAcjs.vi.advanceTimersByTimeAsync(100);
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, promise).resolves.toBe("timeout");
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should return aborted if signal aborts first", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 50);
      const promise = _chunkDX72RHXIcjs.Aborts.awaitAbortOrTimeout(controller.signal, 100);
      await _chunkBFR6AXPAcjs.vi.advanceTimersByTimeAsync(50);
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, promise).resolves.toBe("aborted");
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "raceWithAbort", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should return fulfilled status with value", async () => {
      const controller = new AbortController();
      const result = await _chunkDX72RHXIcjs.Aborts.raceWithAbort(controller.signal, async () => "success");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toEqual({ status: "fulfilled", value: "success" });
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should return aborted status with reason", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 10);
      const promise = _chunkDX72RHXIcjs.Aborts.raceWithAbort(controller.signal, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return "should not reach here";
      });
      await _chunkBFR6AXPAcjs.vi.advanceTimersByTimeAsync(10);
      const result = await promise;
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.status).toBe("aborted");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.reason).toBeInstanceOf(DOMException);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.reason.name).toBe("AbortError");
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should throw non-abort errors", async () => {
      const controller = new AbortController();
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, 
        _chunkDX72RHXIcjs.Aborts.raceWithAbort(controller.signal, async () => {
          throw new Error("fail");
        })
      ).rejects.toThrow("fail");
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "withAbortSignal", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should reject with abort reason if aborted during execution", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new Error("cancelled")), 10);
      const promise = _chunkDX72RHXIcjs.Aborts.withAbortSignal(controller.signal, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
      const catchFn = _chunkBFR6AXPAcjs.vi.fn();
      promise.catch(catchFn);
      await _chunkBFR6AXPAcjs.vi.advanceTimersByTimeAsync(10);
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, promise).rejects.toThrow("cancelled");
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "raceAllWithAbort", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should resolve with first completed promise", async () => {
      const controller = new AbortController();
      const promise = _chunkDX72RHXIcjs.Aborts.raceAllWithAbort(controller.signal, [
        async () => {
          await new Promise((r) => setTimeout(r, 50));
          return 1;
        },
        async () => {
          await new Promise((r) => setTimeout(r, 10));
          return 2;
        }
      ]);
      await _chunkBFR6AXPAcjs.vi.advanceTimersByTimeAsync(10);
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, promise).resolves.toBe(2);
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map