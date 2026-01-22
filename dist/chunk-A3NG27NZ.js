// src/utils/math/usd.ts
import { BigNumber } from "bignumber.js";
var getUsdValue = (rawAmount, decimals, price) => {
  return new BigNumber(rawAmount).times(price).shiftedBy(-decimals);
};

export {
  getUsdValue
};
//# sourceMappingURL=chunk-A3NG27NZ.js.map