"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }

var _chunkWJXWAYMPcjs = require('./chunk-WJXWAYMP.cjs');


var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/utils/aborts/index.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _events = require('events');
var _util = require('util');
async function awaitAbort(signal, resource) {
  if (signal.aborted) {
    return Promise.resolve();
  }
  return _util.aborted.call(void 0, signal, _nullishCoalesce(resource, () => ( {})));
}
async function awaitAbortWithReject(signal) {
  if (signal.aborted) {
    return Promise.reject(getAbortReason(signal));
  }
  return new Promise((_, reject) => {
    const disposable = _events.addAbortListener.call(void 0, signal, () => {
      disposable[Symbol.dispose]();
      reject(getAbortReason(signal));
    });
  });
}
async function awaitAbortOrTimeout(signal, timeoutMs) {
  return Promise.race([
    awaitAbort(signal).then(() => "aborted"),
    _chunkWJXWAYMPcjs.delay.call(void 0, timeoutMs).then(() => "timeout")
  ]);
}
function withAbortSignal(signal, asyncFn) {
  return new Promise((resolve, reject) => {
    const disposable = _events.addAbortListener.call(void 0, signal, () => {
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












exports.awaitAbort = awaitAbort; exports.awaitAbortWithReject = awaitAbortWithReject; exports.awaitAbortOrTimeout = awaitAbortOrTimeout; exports.withAbortSignal = withAbortSignal; exports.raceWithAbort = raceWithAbort; exports.raceAllWithAbort = raceAllWithAbort; exports.createAbortError = createAbortError; exports.getAbortReason = getAbortReason; exports.Aborts = Aborts; exports.aborts_default = aborts_default;
//# sourceMappingURL=chunk-P6LVEPTD.cjs.map