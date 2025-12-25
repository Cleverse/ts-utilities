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
var errors_exports = {};
__export(errors_exports, {
  default: () => errors_default,
  errors: () => errors
});
module.exports = __toCommonJS(errors_exports);
var import_verror = require("verror");
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
    if (_err instanceof import_verror.VError.MultiError) {
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
class errors {
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
    return import_verror.VError.errorFromList(errs);
  }
  static toError(err) {
    if (err instanceof Error) return err;
    if (!err) return new Error("Unknown error");
    return new Error(String(err));
  }
}
var errors_default = errors;
//# sourceMappingURL=index.cjs.map