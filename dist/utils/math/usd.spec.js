import {
  getUsdValue
} from "../../chunk-A3NG27NZ.js";
import {
  describe,
  globalExpect,
  it
} from "../../chunk-AZYASILH.js";
import "../../chunk-G3PMV62Z.js";

// src/utils/math/usd.spec.ts
import { BigNumber } from "bignumber.js";
describe("math/usd", () => {
  it("should calculate USD value correctly", () => {
    const rawAmount = "1000000000000000000";
    const decimals = 18;
    const price = 2000.5;
    const result = getUsdValue(rawAmount, decimals, price);
    globalExpect(result).toBeInstanceOf(BigNumber);
    globalExpect(result.toString()).toBe("2000.5");
  });
  it("should handle different decimals", () => {
    const rawAmount = "1000000";
    const decimals = 6;
    const price = 100;
    const result = getUsdValue(rawAmount, decimals, price);
    globalExpect(result.toString()).toBe("100");
  });
  it("should handle fractional amounts", () => {
    const rawAmount = "500000000000000000";
    const decimals = 18;
    const price = 100;
    const result = getUsdValue(rawAmount, decimals, price);
    globalExpect(result.toString()).toBe("50");
  });
});
//# sourceMappingURL=usd.spec.js.map