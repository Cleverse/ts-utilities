"use strict";
var import_verror = require("verror");
var import_vitest = require("vitest");
var import_index = require("./index");
(0, import_vitest.describe)("errors", () => {
  class CustomError extends Error {
    constructor(message) {
      super(message);
      this.name = "CustomError";
    }
  }
  (0, import_vitest.describe)("find", () => {
    (0, import_vitest.it)("should find error in simple cause chain", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      const found = import_index.errors.find(err, CustomError);
      (0, import_vitest.expect)(found).toBe(root);
      (0, import_vitest.expect)(found).toBeInstanceOf(CustomError);
    });
    (0, import_vitest.it)("should find error in VError chain", () => {
      const root = new CustomError("root");
      const err = new import_verror.VError(root, "wrapper");
      const found = import_index.errors.find(err, CustomError);
      (0, import_vitest.expect)(found).toBe(root);
    });
    (0, import_vitest.it)("should return undefined if not found", () => {
      const err = new Error("simple");
      const found = import_index.errors.find(err, CustomError);
      (0, import_vitest.expect)(found).toBeUndefined();
    });
  });
  (0, import_vitest.describe)("is", () => {
    (0, import_vitest.it)("should return true if error matches type in chain", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      (0, import_vitest.expect)(import_index.errors.is(err, CustomError)).toBe(true);
    });
    (0, import_vitest.it)("should return false if error not found in chain", () => {
      const err = new Error("simple");
      (0, import_vitest.expect)(import_index.errors.is(err, CustomError)).toBe(false);
    });
  });
  (0, import_vitest.describe)("as", () => {
    (0, import_vitest.it)("should return true and narrow type if direct instance", () => {
      const err = new CustomError("test");
      if (import_index.errors.as(err, CustomError)) {
        (0, import_vitest.expect)(err.message).toBe("test");
      } else {
        throw new Error("should be CustomError");
      }
    });
    (0, import_vitest.it)("should return false if not direct instance", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      (0, import_vitest.expect)(import_index.errors.as(err, CustomError)).toBe(false);
    });
  });
  (0, import_vitest.describe)("unwrap", () => {
    (0, import_vitest.it)("should unwrap simple cause", () => {
      const root = new Error("root");
      const err = new Error("wrapper", { cause: root });
      (0, import_vitest.expect)(import_index.errors.unwrap(err)).toBe(root);
    });
    (0, import_vitest.it)("should unwrap VError cause", () => {
      const root = new Error("root");
      const err = new import_verror.VError(root, "wrapper");
      (0, import_vitest.expect)(import_index.errors.unwrap(err)).toBe(root);
    });
    (0, import_vitest.it)("should return undefined if no cause", () => {
      const err = new Error("simple");
      (0, import_vitest.expect)(import_index.errors.unwrap(err)).toBeUndefined();
    });
  });
  (0, import_vitest.describe)("join", () => {
    (0, import_vitest.it)("should join multiple errors into MultiError", () => {
      const err1 = new Error("one");
      const err2 = new Error("two");
      const joined = import_index.errors.join([err1, err2]);
      (0, import_vitest.expect)(joined).toBeInstanceOf(import_verror.VError.MultiError);
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map