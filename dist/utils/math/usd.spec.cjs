"use strict";

var _chunk6EMH2OBCcjs = require('../../chunk-6EMH2OBC.cjs');




var _chunkXDMBOPPTcjs = require('../../chunk-XDMBOPPT.cjs');


var _chunk5JHPDOVLcjs = require('../../chunk-5JHPDOVL.cjs');

// src/utils/math/usd.spec.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
var _bignumberjs = require('bignumber.js');
_chunkXDMBOPPTcjs.describe.call(void 0, "math/usd", () => {
  _chunkXDMBOPPTcjs.it.call(void 0, "should calculate USD value correctly", () => {
    const rawAmount = "1000000000000000000";
    const decimals = 18;
    const price = 2000.5;
    const result = _chunk6EMH2OBCcjs.getUsdValue.call(void 0, rawAmount, decimals, price);
    _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toBeInstanceOf(_bignumberjs.BigNumber);
    _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.toString()).toBe("2000.5");
  });
  _chunkXDMBOPPTcjs.it.call(void 0, "should handle different decimals", () => {
    const rawAmount = "1000000";
    const decimals = 6;
    const price = 100;
    const result = _chunk6EMH2OBCcjs.getUsdValue.call(void 0, rawAmount, decimals, price);
    _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.toString()).toBe("100");
  });
  _chunkXDMBOPPTcjs.it.call(void 0, "should handle fractional amounts", () => {
    const rawAmount = "500000000000000000";
    const decimals = 18;
    const price = 100;
    const result = _chunk6EMH2OBCcjs.getUsdValue.call(void 0, rawAmount, decimals, price);
    _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.toString()).toBe("50");
  });
});
//# sourceMappingURL=usd.spec.cjs.map