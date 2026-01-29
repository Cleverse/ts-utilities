import {
  errors
} from "../../chunk-SHGTG2S3.js";
import {
  describe,
  globalExpect,
  it
} from "../../chunk-AZYASILH.js";
import "../../chunk-G3PMV62Z.js";

// src/utils/errors/index.spec.ts
import { VError } from "verror";
describe("errors", () => {
  class CustomError extends Error {
    constructor(message) {
      super(message);
      this.name = "CustomError";
    }
  }
  describe("find", () => {
    it("should find error in simple cause chain", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      const found = errors.find(err, CustomError);
      globalExpect(found).toBe(root);
      globalExpect(found).toBeInstanceOf(CustomError);
    });
    it("should find error in VError chain", () => {
      const root = new CustomError("root");
      const err = new VError(root, "wrapper");
      const found = errors.find(err, CustomError);
      globalExpect(found).toBe(root);
    });
    it("should return undefined if not found", () => {
      const err = new Error("simple");
      const found = errors.find(err, CustomError);
      globalExpect(found).toBeUndefined();
    });
  });
  describe("is", () => {
    it("should return true if error matches type in chain", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      globalExpect(errors.is(err, CustomError)).toBe(true);
    });
    it("should return false if error not found in chain", () => {
      const err = new Error("simple");
      globalExpect(errors.is(err, CustomError)).toBe(false);
    });
  });
  describe("as", () => {
    it("should return true and narrow type if direct instance", () => {
      const err = new CustomError("test");
      if (errors.as(err, CustomError)) {
        globalExpect(err.message).toBe("test");
      } else {
        throw new Error("should be CustomError");
      }
    });
    it("should return false if not direct instance", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      globalExpect(errors.as(err, CustomError)).toBe(false);
    });
  });
  describe("unwrap", () => {
    it("should unwrap simple cause", () => {
      const root = new Error("root");
      const err = new Error("wrapper", { cause: root });
      globalExpect(errors.unwrap(err)).toBe(root);
    });
    it("should unwrap VError cause", () => {
      const root = new Error("root");
      const err = new VError(root, "wrapper");
      globalExpect(errors.unwrap(err)).toBe(root);
    });
    it("should return undefined if no cause", () => {
      const err = new Error("simple");
      globalExpect(errors.unwrap(err)).toBeUndefined();
    });
  });
  describe("join", () => {
    it("should join multiple errors into MultiError", () => {
      const err1 = new Error("one");
      const err2 = new Error("two");
      const joined = errors.join([err1, err2]);
      globalExpect(joined).toBeInstanceOf(VError.MultiError);
    });
  });
});
//# sourceMappingURL=index.spec.js.map