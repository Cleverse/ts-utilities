"use strict";

var _chunkHCP4PN57cjs = require('../../chunk-HCP4PN57.cjs');
require('../../chunk-P6NRJGVX.cjs');







var _chunkXDMBOPPTcjs = require('../../chunk-XDMBOPPT.cjs');


var _chunk5JHPDOVLcjs = require('../../chunk-5JHPDOVL.cjs');

// src/utils/aborts/index.spec.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
_chunkXDMBOPPTcjs.describe.call(void 0, "aborts", () => {
  _chunkXDMBOPPTcjs.beforeEach.call(void 0, () => {
    _chunkXDMBOPPTcjs.vi.useFakeTimers();
  });
  _chunkXDMBOPPTcjs.afterEach.call(void 0, () => {
    _chunkXDMBOPPTcjs.vi.useRealTimers();
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "awaitAbort", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should resolve when signal is aborted", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 100);
      const promise = _chunkHCP4PN57cjs.Aborts.awaitAbort(controller.signal);
      const resolved = _chunkXDMBOPPTcjs.vi.fn();
      promise.then(resolved);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, resolved).not.toHaveBeenCalled();
      await _chunkXDMBOPPTcjs.vi.advanceTimersByTimeAsync(100);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, resolved).toHaveBeenCalled();
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should resolve immediately if already aborted", async () => {
      const controller = new AbortController();
      controller.abort();
      const promise = _chunkHCP4PN57cjs.Aborts.awaitAbort(controller.signal);
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, promise).resolves.toBeUndefined();
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "awaitAbortWithReject", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should reject when signal is aborted", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new Error("aborted")), 100);
      const promise = _chunkHCP4PN57cjs.Aborts.awaitAbortWithReject(controller.signal);
      const catchFn = _chunkXDMBOPPTcjs.vi.fn();
      promise.catch(catchFn);
      await _chunkXDMBOPPTcjs.vi.advanceTimersByTimeAsync(100);
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, promise).rejects.toThrow("aborted");
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should reject immediately if already aborted", async () => {
      const controller = new AbortController();
      controller.abort(new Error("aborted"));
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkHCP4PN57cjs.Aborts.awaitAbortWithReject(controller.signal)).rejects.toThrow("aborted");
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "awaitAbortOrTimeout", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should return timeout if time passes first", async () => {
      const controller = new AbortController();
      const promise = _chunkHCP4PN57cjs.Aborts.awaitAbortOrTimeout(controller.signal, 100);
      await _chunkXDMBOPPTcjs.vi.advanceTimersByTimeAsync(100);
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, promise).resolves.toBe("timeout");
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should return aborted if signal aborts first", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 50);
      const promise = _chunkHCP4PN57cjs.Aborts.awaitAbortOrTimeout(controller.signal, 100);
      await _chunkXDMBOPPTcjs.vi.advanceTimersByTimeAsync(50);
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, promise).resolves.toBe("aborted");
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "raceWithAbort", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should return fulfilled status with value", async () => {
      const controller = new AbortController();
      const result = await _chunkHCP4PN57cjs.Aborts.raceWithAbort(controller.signal, async () => "success");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toEqual({ status: "fulfilled", value: "success" });
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should return aborted status with reason", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 10);
      const promise = _chunkHCP4PN57cjs.Aborts.raceWithAbort(controller.signal, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return "should not reach here";
      });
      await _chunkXDMBOPPTcjs.vi.advanceTimersByTimeAsync(10);
      const result = await promise;
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.status).toBe("aborted");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.reason).toBeInstanceOf(DOMException);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.reason.name).toBe("AbortError");
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should throw non-abort errors", async () => {
      const controller = new AbortController();
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, 
        _chunkHCP4PN57cjs.Aborts.raceWithAbort(controller.signal, async () => {
          throw new Error("fail");
        })
      ).rejects.toThrow("fail");
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "withAbortSignal", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should reject with abort reason if aborted during execution", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new Error("cancelled")), 10);
      const promise = _chunkHCP4PN57cjs.Aborts.withAbortSignal(controller.signal, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
      const catchFn = _chunkXDMBOPPTcjs.vi.fn();
      promise.catch(catchFn);
      await _chunkXDMBOPPTcjs.vi.advanceTimersByTimeAsync(10);
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, promise).rejects.toThrow("cancelled");
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "raceAllWithAbort", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should resolve with first completed promise", async () => {
      const controller = new AbortController();
      const promise = _chunkHCP4PN57cjs.Aborts.raceAllWithAbort(controller.signal, [
        async () => {
          await new Promise((r) => setTimeout(r, 50));
          return 1;
        },
        async () => {
          await new Promise((r) => setTimeout(r, 10));
          return 2;
        }
      ]);
      await _chunkXDMBOPPTcjs.vi.advanceTimersByTimeAsync(10);
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, promise).resolves.toBe(2);
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map