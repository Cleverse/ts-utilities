import { addAbortListener } from "node:events";
const sleep = (ms, signal) => {
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
const delay = sleep;
export {
  delay,
  sleep
};
//# sourceMappingURL=sleep.js.map