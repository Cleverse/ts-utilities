"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk2X3FSA3Bcjs = require('./chunk-2X3FSA3B.cjs');

// src/utils/math/usd.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var _bignumberjs = require('bignumber.js');
var getUsdValue = (rawAmount, decimals, price) => {
  return new (0, _bignumberjs.BigNumber)(rawAmount).times(price).shiftedBy(-decimals);
};



exports.getUsdValue = getUsdValue;
//# sourceMappingURL=chunk-OUUTWQ2L.cjs.map