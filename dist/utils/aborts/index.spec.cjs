"use strict";
var import_vitest = require("vitest");
var import_index = require("./index");
(0, import_vitest.describe)("aborts", () => {
  (0, import_vitest.beforeEach)(() => {
    import_vitest.vi.useFakeTimers();
  });
  (0, import_vitest.afterEach)(() => {
    import_vitest.vi.useRealTimers();
  });
  (0, import_vitest.describe)("awaitAbort", () => {
    (0, import_vitest.it)("should resolve when signal is aborted", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 100);
      const promise = import_index.Aborts.awaitAbort(controller.signal);
      const resolved = import_vitest.vi.fn();
      promise.then(resolved);
      (0, import_vitest.expect)(resolved).not.toHaveBeenCalled();
      await import_vitest.vi.advanceTimersByTimeAsync(100);
      (0, import_vitest.expect)(resolved).toHaveBeenCalled();
    });
    (0, import_vitest.it)("should resolve immediately if already aborted", async () => {
      const controller = new AbortController();
      controller.abort();
      const promise = import_index.Aborts.awaitAbort(controller.signal);
      await (0, import_vitest.expect)(promise).resolves.toBeUndefined();
    });
  });
  (0, import_vitest.describe)("awaitAbortWithReject", () => {
    (0, import_vitest.it)("should reject when signal is aborted", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new Error("aborted")), 100);
      const promise = import_index.Aborts.awaitAbortWithReject(controller.signal);
      const catchFn = import_vitest.vi.fn();
      promise.catch(catchFn);
      await import_vitest.vi.advanceTimersByTimeAsync(100);
      await (0, import_vitest.expect)(promise).rejects.toThrow("aborted");
    });
    (0, import_vitest.it)("should reject immediately if already aborted", async () => {
      const controller = new AbortController();
      controller.abort(new Error("aborted"));
      await (0, import_vitest.expect)(import_index.Aborts.awaitAbortWithReject(controller.signal)).rejects.toThrow("aborted");
    });
  });
  (0, import_vitest.describe)("awaitAbortOrTimeout", () => {
    (0, import_vitest.it)("should return timeout if time passes first", async () => {
      const controller = new AbortController();
      const promise = import_index.Aborts.awaitAbortOrTimeout(controller.signal, 100);
      await import_vitest.vi.advanceTimersByTimeAsync(100);
      await (0, import_vitest.expect)(promise).resolves.toBe("timeout");
    });
    (0, import_vitest.it)("should return aborted if signal aborts first", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 50);
      const promise = import_index.Aborts.awaitAbortOrTimeout(controller.signal, 100);
      await import_vitest.vi.advanceTimersByTimeAsync(50);
      await (0, import_vitest.expect)(promise).resolves.toBe("aborted");
    });
  });
  (0, import_vitest.describe)("raceWithAbort", () => {
    (0, import_vitest.it)("should return fulfilled status with value", async () => {
      const controller = new AbortController();
      const result = await import_index.Aborts.raceWithAbort(controller.signal, async () => "success");
      (0, import_vitest.expect)(result).toEqual({ status: "fulfilled", value: "success" });
    });
    (0, import_vitest.it)("should return aborted status with reason", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 10);
      const promise = import_index.Aborts.raceWithAbort(controller.signal, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return "should not reach here";
      });
      await import_vitest.vi.advanceTimersByTimeAsync(10);
      const result = await promise;
      (0, import_vitest.expect)(result.status).toBe("aborted");
      (0, import_vitest.expect)(result.reason).toBeInstanceOf(DOMException);
      (0, import_vitest.expect)(result.reason.name).toBe("AbortError");
    });
    (0, import_vitest.it)("should throw non-abort errors", async () => {
      const controller = new AbortController();
      await (0, import_vitest.expect)(
        import_index.Aborts.raceWithAbort(controller.signal, async () => {
          throw new Error("fail");
        })
      ).rejects.toThrow("fail");
    });
  });
  (0, import_vitest.describe)("withAbortSignal", () => {
    (0, import_vitest.it)("should reject with abort reason if aborted during execution", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new Error("cancelled")), 10);
      const promise = import_index.Aborts.withAbortSignal(controller.signal, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
      const catchFn = import_vitest.vi.fn();
      promise.catch(catchFn);
      await import_vitest.vi.advanceTimersByTimeAsync(10);
      await (0, import_vitest.expect)(promise).rejects.toThrow("cancelled");
    });
  });
  (0, import_vitest.describe)("raceAllWithAbort", () => {
    (0, import_vitest.it)("should resolve with first completed promise", async () => {
      const controller = new AbortController();
      const promise = import_index.Aborts.raceAllWithAbort(controller.signal, [
        async () => {
          await new Promise((r) => setTimeout(r, 50));
          return 1;
        },
        async () => {
          await new Promise((r) => setTimeout(r, 10));
          return 2;
        }
      ]);
      await import_vitest.vi.advanceTimersByTimeAsync(10);
      await (0, import_vitest.expect)(promise).resolves.toBe(2);
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map