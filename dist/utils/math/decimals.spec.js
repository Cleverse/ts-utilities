import {
  describe,
  globalExpect,
  it
} from "../../chunk-OKMIIXBO.js";
import {
  fromDecimal,
  toBigint,
  toDecimal,
  toNumber
} from "../../chunk-EXLKWFKF.js";
import "../../chunk-G3PMV62Z.js";

// src/utils/math/decimals.spec.ts
import { BigNumber } from "bignumber.js";
describe("math/decimals", () => {
  describe("toDecimal", () => {
    it("should convert wei to decimal with default 18 decimals", () => {
      const wei = BigInt("1000000000000000000");
      const result = toDecimal(wei);
      globalExpect(result).toBeInstanceOf(BigNumber);
      globalExpect(result.toString()).toBe("1");
    });
    it("should convert wei to decimal with custom decimals", () => {
      const wei = BigInt("1000000");
      const result = toDecimal(wei, 6);
      globalExpect(result.toString()).toBe("1");
    });
    it("should handle partial decimal values", () => {
      const wei = BigInt("1500000000000000000");
      const result = toDecimal(wei);
      globalExpect(result.toString()).toBe("1.5");
    });
  });
  describe("toNumber", () => {
    it("should convert wei to number", () => {
      const wei = BigInt("1500000000000000000");
      const result = toNumber(wei);
      globalExpect(typeof result).toBe("number");
      globalExpect(result).toBe(1.5);
    });
  });
  describe("fromDecimal", () => {
    it("should convert number to wei", () => {
      const value = 1.5;
      const result = fromDecimal(value);
      globalExpect(typeof result).toBe("bigint");
      globalExpect(result).toBe(BigInt("1500000000000000000"));
    });
    it("should convert BigNumber to wei", () => {
      const value = new BigNumber("1.5");
      const result = fromDecimal(value);
      globalExpect(result).toBe(BigInt("1500000000000000000"));
    });
    it("should handle custom decimals", () => {
      const value = 1;
      const result = fromDecimal(value, 6);
      globalExpect(result).toBe(BigInt("1000000"));
    });
  });
  describe("toBigint", () => {
    it("should be an alias for fromDecimal", () => {
      const value = 1.5;
      const result = toBigint(value);
      globalExpect(result).toBe(BigInt("1500000000000000000"));
    });
  });
});
//# sourceMappingURL=decimals.spec.js.map