"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var aborts_exports = {};
__export(aborts_exports, {
  Aborts: () => Aborts,
  awaitAbort: () => awaitAbort,
  awaitAbortOrTimeout: () => awaitAbortOrTimeout,
  awaitAbortWithReject: () => awaitAbortWithReject,
  createAbortError: () => createAbortError,
  default: () => aborts_default,
  getAbortReason: () => getAbortReason,
  raceAllWithAbort: () => raceAllWithAbort,
  raceWithAbort: () => raceWithAbort,
  withAbortSignal: () => withAbortSignal
});
module.exports = __toCommonJS(aborts_exports);
var import_node_events = require("node:events");
var import_node_util = require("node:util");
var import_sleep = require("../miscellaneous/sleep");
async function awaitAbort(signal, resource) {
  if (signal.aborted) {
    return Promise.resolve();
  }
  return (0, import_node_util.aborted)(signal, resource ?? {});
}
async function awaitAbortWithReject(signal) {
  if (signal.aborted) {
    return Promise.reject(getAbortReason(signal));
  }
  return new Promise((_, reject) => {
    const disposable = (0, import_node_events.addAbortListener)(signal, () => {
      disposable[Symbol.dispose]();
      reject(getAbortReason(signal));
    });
  });
}
async function awaitAbortOrTimeout(signal, timeoutMs) {
  return Promise.race([
    awaitAbort(signal).then(() => "aborted"),
    (0, import_sleep.delay)(timeoutMs).then(() => "timeout")
  ]);
}
function withAbortSignal(signal, asyncFn) {
  return new Promise((resolve, reject) => {
    const disposable = (0, import_node_events.addAbortListener)(signal, () => {
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
const Aborts = {
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
//# sourceMappingURL=index.cjs.map