"use strict";

var _chunkXPEB3IHZcjs = require('../../chunk-XPEB3IHZ.cjs');




var _chunk5BHWYHGYcjs = require('../../chunk-5BHWYHGY.cjs');


var _chunkT6TWWATEcjs = require('../../chunk-T6TWWATE.cjs');

// src/utils/math/usd.spec.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _bignumberjs = require('bignumber.js');
_chunk5BHWYHGYcjs.describe.call(void 0, "math/usd", () => {
  _chunk5BHWYHGYcjs.it.call(void 0, "should calculate USD value correctly", () => {
    const rawAmount = "1000000000000000000";
    const decimals = 18;
    const price = 2000.5;
    const result = _chunkXPEB3IHZcjs.getUsdValue.call(void 0, rawAmount, decimals, price);
    _chunk5BHWYHGYcjs.globalExpect.call(void 0, result).toBeInstanceOf(_bignumberjs.BigNumber);
    _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.toString()).toBe("2000.5");
  });
  _chunk5BHWYHGYcjs.it.call(void 0, "should handle different decimals", () => {
    const rawAmount = "1000000";
    const decimals = 6;
    const price = 100;
    const result = _chunkXPEB3IHZcjs.getUsdValue.call(void 0, rawAmount, decimals, price);
    _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.toString()).toBe("100");
  });
  _chunk5BHWYHGYcjs.it.call(void 0, "should handle fractional amounts", () => {
    const rawAmount = "500000000000000000";
    const decimals = 18;
    const price = 100;
    const result = _chunkXPEB3IHZcjs.getUsdValue.call(void 0, rawAmount, decimals, price);
    _chunk5BHWYHGYcjs.globalExpect.call(void 0, result.toString()).toBe("50");
  });
});
//# sourceMappingURL=usd.spec.cjs.map