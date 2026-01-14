"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk5JHPDOVLcjs = require('./chunk-5JHPDOVL.cjs');

// src/utils/math/usd.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
var _bignumberjs = require('bignumber.js');
var getUsdValue = (rawAmount, decimals, price) => {
  return new (0, _bignumberjs.BigNumber)(rawAmount).times(price).shiftedBy(-decimals);
};



exports.getUsdValue = getUsdValue;
//# sourceMappingURL=chunk-6EMH2OBC.cjs.map