"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }

var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/utils/miscellaneous/retry.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _retry = require('retry');
var AbortError = class extends Error {
  
  constructor(message) {
    super();
    if (message instanceof Error) {
      this.originalError = message;
      ({ message } = message);
    } else {
      this.originalError = new Error(message);
      this.originalError.stack = this.stack;
    }
    this.name = "AbortError";
    this.message = message;
  }
};
var decorateErrorWithCounts = (error, attemptNumber, options) => {
  const retriesLeft = (_nullishCoalesce(options.retries, () => ( 10))) - (attemptNumber - 1);
  error.attemptNumber = attemptNumber;
  error.retriesLeft = retriesLeft;
  return error;
};
async function retry(input, options) {
  return new Promise((resolve, reject) => {
    options = { ...options };
    options.onFailedAttempt ??= () => {
    };
    options.shouldRetry ??= () => true;
    options.retries ??= 10;
    const operation = _retry.operation.call(void 0, options);
    const cleanUp = () => {
      operation.stop();
    };
    operation.attempt(async (attemptNumber) => {
      try {
        const result = await input(attemptNumber);
        cleanUp();
        resolve(result);
      } catch (error) {
        try {
          if (!(error instanceof Error)) {
            throw new TypeError(`Non-error was thrown: "${error}". You should only throw errors.`);
          }
          if (error instanceof AbortError) {
            throw error.originalError;
          }
          decorateErrorWithCounts(error, attemptNumber, options);
          if (options.shouldRetry && !await options.shouldRetry(error)) {
            operation.stop();
            reject(error);
          }
          options.onFailedAttempt && await options.onFailedAttempt(error);
          if (!operation.retry(error)) {
            throw operation.mainError();
          }
        } catch (finalError) {
          decorateErrorWithCounts(finalError, attemptNumber, options);
          cleanUp();
          reject(finalError);
        }
      }
    });
  });
}
var retry_default = retry;





exports.AbortError = AbortError; exports.retry = retry; exports.retry_default = retry_default;
//# sourceMappingURL=chunk-C4CXLHXF.cjs.map