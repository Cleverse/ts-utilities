import { BigNumber } from "bignumber.js";
import { describe, expect, it } from "vitest";
import { getUsdValue } from "./usd";
describe("math/usd", () => {
  it("should calculate USD value correctly", () => {
    const rawAmount = "1000000000000000000";
    const decimals = 18;
    const price = 2000.5;
    const result = getUsdValue(rawAmount, decimals, price);
    expect(result).toBeInstanceOf(BigNumber);
    expect(result.toString()).toBe("2000.5");
  });
  it("should handle different decimals", () => {
    const rawAmount = "1000000";
    const decimals = 6;
    const price = 100;
    const result = getUsdValue(rawAmount, decimals, price);
    expect(result.toString()).toBe("100");
  });
  it("should handle fractional amounts", () => {
    const rawAmount = "500000000000000000";
    const decimals = 18;
    const price = 100;
    const result = getUsdValue(rawAmount, decimals, price);
    expect(result.toString()).toBe("50");
  });
});
//# sourceMappingURL=usd.spec.js.map