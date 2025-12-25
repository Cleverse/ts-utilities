"use strict";
var import_bignumber = require("bignumber.js");
var import_vitest = require("vitest");
var import_usd = require("./usd");
(0, import_vitest.describe)("math/usd", () => {
  (0, import_vitest.it)("should calculate USD value correctly", () => {
    const rawAmount = "1000000000000000000";
    const decimals = 18;
    const price = 2000.5;
    const result = (0, import_usd.getUsdValue)(rawAmount, decimals, price);
    (0, import_vitest.expect)(result).toBeInstanceOf(import_bignumber.BigNumber);
    (0, import_vitest.expect)(result.toString()).toBe("2000.5");
  });
  (0, import_vitest.it)("should handle different decimals", () => {
    const rawAmount = "1000000";
    const decimals = 6;
    const price = 100;
    const result = (0, import_usd.getUsdValue)(rawAmount, decimals, price);
    (0, import_vitest.expect)(result.toString()).toBe("100");
  });
  (0, import_vitest.it)("should handle fractional amounts", () => {
    const rawAmount = "500000000000000000";
    const decimals = 18;
    const price = 100;
    const result = (0, import_usd.getUsdValue)(rawAmount, decimals, price);
    (0, import_vitest.expect)(result.toString()).toBe("50");
  });
});
//# sourceMappingURL=usd.spec.cjs.map