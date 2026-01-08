"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk5JHPDOVLcjs = require('./chunk-5JHPDOVL.cjs');

// src/utils/errors/index.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
var _verror = require('verror');
function unwrap(err) {
  if (!err || typeof err !== "object" || !("cause" in err)) return void 0;
  if (typeof err.cause === "function") {
    const causeResult = err.cause();
    return causeResult instanceof Error ? causeResult : void 0;
  } else {
    return err.cause instanceof Error ? err.cause : void 0;
  }
}
function findCause(err, reference) {
  if (!(err instanceof Error)) return;
  if (!err || !reference) return;
  if (!(reference.prototype instanceof Error) && // @ts-ignore
  reference !== Error) {
    return;
  }
  const seen = /* @__PURE__ */ new Set();
  let _err = err;
  while (_err && !seen.has(_err)) {
    seen.add(_err);
    if (_err instanceof reference) {
      return _err;
    }
    if (_err instanceof _verror.VError.MultiError) {
      for (const err2 of _err.errors()) {
        const result = findCause(err2, reference);
        if (result) {
          return result;
        }
      }
    } else {
      _err = unwrap(_err);
    }
  }
  return;
}
var errors = class {
  /**
   * Finding an error of a specific type within the cause chain.
   *
   * Support normal error cause (ES2021+) and VError/NError style causes
   */
  static find(err, reference) {
    return findCause(err, reference);
  }
  /**
   * Finding an wrapped error is a match of the reference error.
   * It's like `errors.Is` in Golang.
   *
   * Support normal error cause (ES2021+) and VError/NError style causes
   *
   * @example
   * ```ts
   * try {
   *   await someRecoverableTask().catch((err) => {
   *     throw new Error("failed to do something", { cause: err })
   *   })
   * } catch (err: unknown) {
   *   // `true`
   *   if (errors.is(err, Error)){
   *     console.error(err.message) // auto type inference to `Error`
   *   }
   *
   *   // `true` supports to check chain of errors cause
   *   if (errors.is(err, RecoverableError)){
   *     console.error(err.message) // auto type inference to `Error`
   *   }
   * }
   * ```
   */
  static is(err, reference) {
    return findCause(err, reference) !== void 0;
  }
  /**
   * Checking and casting an error to a specific type.
   * It's like `errors.As` in Golang.
   *
   * @example
   * ```ts
   * try {
   *   await someRecoverableTask().catch((err) => {
   *     throw new HTTPError(401, "failed to do something")
   *   })
   * } catch (err: unknown) {
   *   // `true`
   *   if (errors.as(err, HTTPError)){
   *     console.error(err.code) // type inference to `HTTPError`
   *   }
   *
   *   // `true` because `HTTPError` is inherited from `Error`
   *   if (errors.as(err, Error)){
   *     console.error(err.message) // type inference to `Error`
   *   }
   * }
   * ```
   */
  static as(err, reference) {
    return err instanceof reference;
  }
  /**
   * Unwrapping the error cause.
   *
   * Support normal error cause (ES2021+) and VError/NError style causes
   */
  static unwrap(err) {
    if (!(err instanceof Error)) return void 0;
    return unwrap(err);
  }
  /**
   * Joining multiple errors.
   */
  static join(errs) {
    return _verror.VError.errorFromList(errs);
  }
  static toError(err) {
    if (err instanceof Error) return err;
    if (!err) return new Error("Unknown error");
    return new Error(String(err));
  }
};
var errors_default = errors;




exports.errors = errors; exports.errors_default = errors_default;
//# sourceMappingURL=chunk-X2LBWM7I.cjs.map