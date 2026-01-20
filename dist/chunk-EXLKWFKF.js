// src/utils/math/decimals.ts
import { BigNumber } from "bignumber.js";
function toDecimal(value, decimals2 = 18) {
  return BigNumber(value.toString()).div(BigNumber(10).pow(decimals2));
}
function toNumber(value, decimals2 = 18) {
  return toDecimal(value, decimals2).toNumber();
}
function fromDecimal(value, decimals2 = 18) {
  const bn = new BigNumber(value).multipliedBy(BigNumber(10).pow(decimals2));
  return BigInt(bn.toFixed());
}
function toBigint(value, decimals2 = 18) {
  return fromDecimal(value, decimals2);
}
var decimals = {
  toDecimal,
  toNumber,
  fromDecimal,
  toBigint
};

export {
  toDecimal,
  toNumber,
  fromDecimal,
  toBigint,
  decimals
};
//# sourceMappingURL=chunk-EXLKWFKF.js.map