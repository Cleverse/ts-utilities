"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/utils/miscellaneous/sleep.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _events = require('events');
var sleep = (ms, signal) => {
  if (_optionalChain([signal, 'optionalAccess', _ => _.aborted])) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    if (signal) {
      const disposable = _events.addAbortListener.call(void 0, signal, () => {
        clearTimeout(timer);
        disposable[Symbol.dispose]();
        resolve();
      });
    }
  });
};
var delay = sleep;




exports.sleep = sleep; exports.delay = delay;
//# sourceMappingURL=chunk-WJXWAYMP.cjs.map