"use strict";
var import_vitest = require("vitest");
var import_sleep = require("./sleep");
(0, import_vitest.describe)("miscellaneous/sleep", () => {
  (0, import_vitest.beforeEach)(() => {
    import_vitest.vi.useFakeTimers();
  });
  (0, import_vitest.afterEach)(() => {
    import_vitest.vi.useRealTimers();
  });
  (0, import_vitest.it)("should wait for specified time", async () => {
    const ms = 1e3;
    const promise = (0, import_sleep.sleep)(ms);
    const resolved = import_vitest.vi.fn();
    promise.then(resolved);
    (0, import_vitest.expect)(resolved).not.toHaveBeenCalled();
    await import_vitest.vi.advanceTimersByTimeAsync(ms);
    (0, import_vitest.expect)(resolved).toHaveBeenCalled();
  });
  (0, import_vitest.it)("should resolve immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const promise = (0, import_sleep.sleep)(1e3, controller.signal);
    await (0, import_vitest.expect)(promise).resolves.toBeUndefined();
  });
  (0, import_vitest.it)("should abort sleeping when signal is aborted", async () => {
    const controller = new AbortController();
    const ms = 5e3;
    const promise = (0, import_sleep.sleep)(ms, controller.signal);
    await import_vitest.vi.advanceTimersByTimeAsync(100);
    controller.abort();
    await (0, import_vitest.expect)(promise).resolves.toBeUndefined();
  });
  (0, import_vitest.it)("should have delay alias", () => {
    (0, import_vitest.expect)(import_sleep.delay).toBe(import_sleep.sleep);
  });
});
//# sourceMappingURL=sleep.spec.cjs.map