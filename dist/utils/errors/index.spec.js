import { VError } from "verror";
import { describe, expect, it } from "vitest";
import { errors } from "./index";
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
      expect(found).toBe(root);
      expect(found).toBeInstanceOf(CustomError);
    });
    it("should find error in VError chain", () => {
      const root = new CustomError("root");
      const err = new VError(root, "wrapper");
      const found = errors.find(err, CustomError);
      expect(found).toBe(root);
    });
    it("should return undefined if not found", () => {
      const err = new Error("simple");
      const found = errors.find(err, CustomError);
      expect(found).toBeUndefined();
    });
  });
  describe("is", () => {
    it("should return true if error matches type in chain", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      expect(errors.is(err, CustomError)).toBe(true);
    });
    it("should return false if error not found in chain", () => {
      const err = new Error("simple");
      expect(errors.is(err, CustomError)).toBe(false);
    });
  });
  describe("as", () => {
    it("should return true and narrow type if direct instance", () => {
      const err = new CustomError("test");
      if (errors.as(err, CustomError)) {
        expect(err.message).toBe("test");
      } else {
        throw new Error("should be CustomError");
      }
    });
    it("should return false if not direct instance", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      expect(errors.as(err, CustomError)).toBe(false);
    });
  });
  describe("unwrap", () => {
    it("should unwrap simple cause", () => {
      const root = new Error("root");
      const err = new Error("wrapper", { cause: root });
      expect(errors.unwrap(err)).toBe(root);
    });
    it("should unwrap VError cause", () => {
      const root = new Error("root");
      const err = new VError(root, "wrapper");
      expect(errors.unwrap(err)).toBe(root);
    });
    it("should return undefined if no cause", () => {
      const err = new Error("simple");
      expect(errors.unwrap(err)).toBeUndefined();
    });
  });
  describe("join", () => {
    it("should join multiple errors into MultiError", () => {
      const err1 = new Error("one");
      const err2 = new Error("two");
      const joined = errors.join([err1, err2]);
      expect(joined).toBeInstanceOf(VError.MultiError);
    });
  });
});
//# sourceMappingURL=index.spec.js.map