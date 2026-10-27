"use strict";

var _chunkOUUTWQ2Lcjs = require('../../chunk-OUUTWQ2L.cjs');




var _chunkBFR6AXPAcjs = require('../../chunk-BFR6AXPA.cjs');


var _chunk2X3FSA3Bcjs = require('../../chunk-2X3FSA3B.cjs');

// src/utils/math/usd.spec.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var _bignumberjs = require('bignumber.js');
_chunkBFR6AXPAcjs.describe.call(void 0, "math/usd", () => {
  _chunkBFR6AXPAcjs.it.call(void 0, "should calculate USD value correctly", () => {
    const rawAmount = "1000000000000000000";
    const decimals = 18;
    const price = 2000.5;
    const result = _chunkOUUTWQ2Lcjs.getUsdValue.call(void 0, rawAmount, decimals, price);
    _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toBeInstanceOf(_bignumberjs.BigNumber);
    _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.toString()).toBe("2000.5");
  });
  _chunkBFR6AXPAcjs.it.call(void 0, "should handle different decimals", () => {
    const rawAmount = "1000000";
    const decimals = 6;
    const price = 100;
    const result = _chunkOUUTWQ2Lcjs.getUsdValue.call(void 0, rawAmount, decimals, price);
    _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.toString()).toBe("100");
  });
  _chunkBFR6AXPAcjs.it.call(void 0, "should handle fractional amounts", () => {
    const rawAmount = "500000000000000000";
    const decimals = 18;
    const price = 100;
    const result = _chunkOUUTWQ2Lcjs.getUsdValue.call(void 0, rawAmount, decimals, price);
    _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.toString()).toBe("50");
  });
});
//# sourceMappingURL=usd.spec.cjs.map