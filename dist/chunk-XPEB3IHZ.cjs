"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/utils/math/usd.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _bignumberjs = require('bignumber.js');
var getUsdValue = (rawAmount, decimals, price) => {
  return new (0, _bignumberjs.BigNumber)(rawAmount).times(price).shiftedBy(-decimals);
};



exports.getUsdValue = getUsdValue;
//# sourceMappingURL=chunk-XPEB3IHZ.cjs.map