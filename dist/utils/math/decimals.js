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
const decimals = {
  toDecimal,
  toNumber,
  fromDecimal,
  toBigint
};
export {
  decimals,
  fromDecimal,
  toBigint,
  toDecimal,
  toNumber
};
//# sourceMappingURL=decimals.js.map