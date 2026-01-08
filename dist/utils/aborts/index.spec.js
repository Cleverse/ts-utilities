import {
  Aborts
} from "../../chunk-6J37UYJM.js";
import "../../chunk-VIEIQ547.js";
import {
  afterEach,
  beforeEach,
  describe,
  globalExpect,
  it,
  vi
} from "../../chunk-OKMIIXBO.js";
import "../../chunk-G3PMV62Z.js";

// src/utils/aborts/index.spec.ts
describe("aborts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  describe("awaitAbort", () => {
    it("should resolve when signal is aborted", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 100);
      const promise = Aborts.awaitAbort(controller.signal);
      const resolved = vi.fn();
      promise.then(resolved);
      globalExpect(resolved).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(100);
      globalExpect(resolved).toHaveBeenCalled();
    });
    it("should resolve immediately if already aborted", async () => {
      const controller = new AbortController();
      controller.abort();
      const promise = Aborts.awaitAbort(controller.signal);
      await globalExpect(promise).resolves.toBeUndefined();
    });
  });
  describe("awaitAbortWithReject", () => {
    it("should reject when signal is aborted", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new Error("aborted")), 100);
      const promise = Aborts.awaitAbortWithReject(controller.signal);
      const catchFn = vi.fn();
      promise.catch(catchFn);
      await vi.advanceTimersByTimeAsync(100);
      await globalExpect(promise).rejects.toThrow("aborted");
    });
    it("should reject immediately if already aborted", async () => {
      const controller = new AbortController();
      controller.abort(new Error("aborted"));
      await globalExpect(Aborts.awaitAbortWithReject(controller.signal)).rejects.toThrow("aborted");
    });
  });
  describe("awaitAbortOrTimeout", () => {
    it("should return timeout if time passes first", async () => {
      const controller = new AbortController();
      const promise = Aborts.awaitAbortOrTimeout(controller.signal, 100);
      await vi.advanceTimersByTimeAsync(100);
      await globalExpect(promise).resolves.toBe("timeout");
    });
    it("should return aborted if signal aborts first", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 50);
      const promise = Aborts.awaitAbortOrTimeout(controller.signal, 100);
      await vi.advanceTimersByTimeAsync(50);
      await globalExpect(promise).resolves.toBe("aborted");
    });
  });
  describe("raceWithAbort", () => {
    it("should return fulfilled status with value", async () => {
      const controller = new AbortController();
      const result = await Aborts.raceWithAbort(controller.signal, async () => "success");
      globalExpect(result).toEqual({ status: "fulfilled", value: "success" });
    });
    it("should return aborted status with reason", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 10);
      const promise = Aborts.raceWithAbort(controller.signal, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return "should not reach here";
      });
      await vi.advanceTimersByTimeAsync(10);
      const result = await promise;
      globalExpect(result.status).toBe("aborted");
      globalExpect(result.reason).toBeInstanceOf(DOMException);
      globalExpect(result.reason.name).toBe("AbortError");
    });
    it("should throw non-abort errors", async () => {
      const controller = new AbortController();
      await globalExpect(
        Aborts.raceWithAbort(controller.signal, async () => {
          throw new Error("fail");
        })
      ).rejects.toThrow("fail");
    });
  });
  describe("withAbortSignal", () => {
    it("should reject with abort reason if aborted during execution", async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new Error("cancelled")), 10);
      const promise = Aborts.withAbortSignal(controller.signal, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
      const catchFn = vi.fn();
      promise.catch(catchFn);
      await vi.advanceTimersByTimeAsync(10);
      await globalExpect(promise).rejects.toThrow("cancelled");
    });
  });
  describe("raceAllWithAbort", () => {
    it("should resolve with first completed promise", async () => {
      const controller = new AbortController();
      const promise = Aborts.raceAllWithAbort(controller.signal, [
        async () => {
          await new Promise((r) => setTimeout(r, 50));
          return 1;
        },
        async () => {
          await new Promise((r) => setTimeout(r, 10));
          return 2;
        }
      ]);
      await vi.advanceTimersByTimeAsync(10);
      await globalExpect(promise).resolves.toBe(2);
    });
  });
});
//# sourceMappingURL=index.spec.js.map