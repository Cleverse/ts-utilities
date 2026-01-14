import {
  delay
} from "./chunk-VIEIQ547.js";

// src/utils/aborts/index.ts
import { addAbortListener } from "events";
import { aborted } from "util";
async function awaitAbort(signal, resource) {
  if (signal.aborted) {
    return Promise.resolve();
  }
  return aborted(signal, resource ?? {});
}
async function awaitAbortWithReject(signal) {
  if (signal.aborted) {
    return Promise.reject(getAbortReason(signal));
  }
  return new Promise((_, reject) => {
    const disposable = addAbortListener(signal, () => {
      disposable[Symbol.dispose]();
      reject(getAbortReason(signal));
    });
  });
}
async function awaitAbortOrTimeout(signal, timeoutMs) {
  return Promise.race([
    awaitAbort(signal).then(() => "aborted"),
    delay(timeoutMs).then(() => "timeout")
  ]);
}
function withAbortSignal(signal, asyncFn) {
  return new Promise((resolve, reject) => {
    const disposable = addAbortListener(signal, () => {
      disposable[Symbol.dispose]();
      reject(getAbortReason(signal));
    });
    asyncFn().then(resolve).catch(reject).finally(() => disposable[Symbol.dispose]());
  });
}
async function raceWithAbort(signal, asyncFn) {
  try {
    const value = await withAbortSignal(signal, asyncFn);
    return { status: "fulfilled", value };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { status: "aborted", reason: error };
    }
    throw error;
  }
}
function raceAllWithAbort(signal, asyncFns) {
  return withAbortSignal(signal, () => Promise.race(asyncFns.map((fn) => fn())));
}
function createAbortError(reason) {
  const message = reason instanceof Error ? reason.message : typeof reason === "string" ? reason : "The operation was aborted";
  return new DOMException(message, "AbortError");
}
function getAbortReason(signal) {
  if (signal.reason instanceof Error) {
    return signal.reason;
  }
  return createAbortError(signal.reason);
}
var Aborts = {
  awaitAbort,
  awaitAbortWithReject,
  awaitAbortOrTimeout,
  withAbortSignal,
  raceWithAbort,
  raceAllWithAbort,
  createAbortError,
  getAbortReason
};
var aborts_default = Aborts;

export {
  awaitAbort,
  awaitAbortWithReject,
  awaitAbortOrTimeout,
  withAbortSignal,
  raceWithAbort,
  raceAllWithAbort,
  createAbortError,
  getAbortReason,
  Aborts,
  aborts_default
};
//# sourceMappingURL=chunk-6J37UYJM.js.map