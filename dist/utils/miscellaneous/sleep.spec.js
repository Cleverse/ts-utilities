import {
  delay,
  sleep
} from "../../chunk-VIEIQ547.js";
import {
  afterEach,
  beforeEach,
  describe,
  globalExpect,
  it,
  vi
} from "../../chunk-OKMIIXBO.js";
import "../../chunk-G3PMV62Z.js";

// src/utils/miscellaneous/sleep.spec.ts
describe("miscellaneous/sleep", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("should wait for specified time", async () => {
    const ms = 1e3;
    const promise = sleep(ms);
    const resolved = vi.fn();
    promise.then(resolved);
    globalExpect(resolved).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(ms);
    globalExpect(resolved).toHaveBeenCalled();
  });
  it("should resolve immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const promise = sleep(1e3, controller.signal);
    await globalExpect(promise).resolves.toBeUndefined();
  });
  it("should abort sleeping when signal is aborted", async () => {
    const controller = new AbortController();
    const ms = 5e3;
    const promise = sleep(ms, controller.signal);
    await vi.advanceTimersByTimeAsync(100);
    controller.abort();
    await globalExpect(promise).resolves.toBeUndefined();
  });
  it("should have delay alias", () => {
    globalExpect(delay).toBe(sleep);
  });
});
//# sourceMappingURL=sleep.spec.js.map