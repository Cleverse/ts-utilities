import { operation as retryOperation } from "retry";
class AbortError extends Error {
  originalError;
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
}
const decorateErrorWithCounts = (error, attemptNumber, options) => {
  const retriesLeft = (options.retries ?? 10) - (attemptNumber - 1);
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
    const operation = retryOperation(options);
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
export {
  AbortError,
  retry_default as default,
  retry
};
//# sourceMappingURL=retry.js.map