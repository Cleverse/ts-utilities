import { BigNumber } from "bignumber.js";
const getUsdValue = (rawAmount, decimals, price) => {
  return new BigNumber(rawAmount).times(price).shiftedBy(-decimals);
};
export {
  getUsdValue
};
//# sourceMappingURL=usd.js.map