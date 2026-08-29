// src/utils/miscellaneous/sleep.ts
import { addAbortListener } from "events";
var sleep = (ms, signal) => {
  if (signal?.aborted) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    if (signal) {
      const disposable = addAbortListener(signal, () => {
        clearTimeout(timer);
        disposable[Symbol.dispose]();
        resolve();
      });
    }
  });
};
var delay = sleep;

export {
  sleep,
  delay
};
//# sourceMappingURL=chunk-VIEIQ547.js.map