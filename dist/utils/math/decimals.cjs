"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var decimals_exports = {};
__export(decimals_exports, {
  decimals: () => decimals,
  fromDecimal: () => fromDecimal,
  toBigint: () => toBigint,
  toDecimal: () => toDecimal,
  toNumber: () => toNumber
});
module.exports = __toCommonJS(decimals_exports);
var import_bignumber = require("bignumber.js");
function toDecimal(value, decimals2 = 18) {
  return (0, import_bignumber.BigNumber)(value.toString()).div((0, import_bignumber.BigNumber)(10).pow(decimals2));
}
function toNumber(value, decimals2 = 18) {
  return toDecimal(value, decimals2).toNumber();
}
function fromDecimal(value, decimals2 = 18) {
  const bn = new import_bignumber.BigNumber(value).multipliedBy((0, import_bignumber.BigNumber)(10).pow(decimals2));
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
//# sourceMappingURL=decimals.cjs.map