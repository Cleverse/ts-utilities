"use strict";
var import_bignumber = require("bignumber.js");
var import_vitest = require("vitest");
var import_decimals = require("./decimals");
(0, import_vitest.describe)("math/decimals", () => {
  (0, import_vitest.describe)("toDecimal", () => {
    (0, import_vitest.it)("should convert wei to decimal with default 18 decimals", () => {
      const wei = BigInt("1000000000000000000");
      const result = (0, import_decimals.toDecimal)(wei);
      (0, import_vitest.expect)(result).toBeInstanceOf(import_bignumber.BigNumber);
      (0, import_vitest.expect)(result.toString()).toBe("1");
    });
    (0, import_vitest.it)("should convert wei to decimal with custom decimals", () => {
      const wei = BigInt("1000000");
      const result = (0, import_decimals.toDecimal)(wei, 6);
      (0, import_vitest.expect)(result.toString()).toBe("1");
    });
    (0, import_vitest.it)("should handle partial decimal values", () => {
      const wei = BigInt("1500000000000000000");
      const result = (0, import_decimals.toDecimal)(wei);
      (0, import_vitest.expect)(result.toString()).toBe("1.5");
    });
  });
  (0, import_vitest.describe)("toNumber", () => {
    (0, import_vitest.it)("should convert wei to number", () => {
      const wei = BigInt("1500000000000000000");
      const result = (0, import_decimals.toNumber)(wei);
      (0, import_vitest.expect)(typeof result).toBe("number");
      (0, import_vitest.expect)(result).toBe(1.5);
    });
  });
  (0, import_vitest.describe)("fromDecimal", () => {
    (0, import_vitest.it)("should convert number to wei", () => {
      const value = 1.5;
      const result = (0, import_decimals.fromDecimal)(value);
      (0, import_vitest.expect)(typeof result).toBe("bigint");
      (0, import_vitest.expect)(result).toBe(BigInt("1500000000000000000"));
    });
    (0, import_vitest.it)("should convert BigNumber to wei", () => {
      const value = new import_bignumber.BigNumber("1.5");
      const result = (0, import_decimals.fromDecimal)(value);
      (0, import_vitest.expect)(result).toBe(BigInt("1500000000000000000"));
    });
    (0, import_vitest.it)("should handle custom decimals", () => {
      const value = 1;
      const result = (0, import_decimals.fromDecimal)(value, 6);
      (0, import_vitest.expect)(result).toBe(BigInt("1000000"));
    });
  });
  (0, import_vitest.describe)("toBigint", () => {
    (0, import_vitest.it)("should be an alias for fromDecimal", () => {
      const value = 1.5;
      const result = (0, import_decimals.toBigint)(value);
      (0, import_vitest.expect)(result).toBe(BigInt("1500000000000000000"));
    });
  });
});
//# sourceMappingURL=decimals.spec.cjs.map