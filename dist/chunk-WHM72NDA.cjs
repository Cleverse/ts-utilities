"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk2X3FSA3Bcjs = require('./chunk-2X3FSA3B.cjs');

// src/utils/math/decimals.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var _bignumberjs = require('bignumber.js');
function toDecimal(value, decimals2 = 18) {
  return _bignumberjs.BigNumber.call(void 0, value.toString()).div(_bignumberjs.BigNumber.call(void 0, 10).pow(decimals2));
}
function toNumber(value, decimals2 = 18) {
  return toDecimal(value, decimals2).toNumber();
}
function fromDecimal(value, decimals2 = 18) {
  const bn = new (0, _bignumberjs.BigNumber)(value).multipliedBy(_bignumberjs.BigNumber.call(void 0, 10).pow(decimals2));
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







exports.toDecimal = toDecimal; exports.toNumber = toNumber; exports.fromDecimal = fromDecimal; exports.toBigint = toBigint; exports.decimals = decimals;
//# sourceMappingURL=chunk-WHM72NDA.cjs.map