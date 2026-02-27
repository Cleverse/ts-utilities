"use strict";




var _chunkRUIKAUOAcjs = require('../../chunk-RUIKAUOA.cjs');




var _chunkDS2XYV5Gcjs = require('../../chunk-DS2XYV5G.cjs');


var _chunkT6TWWATEcjs = require('../../chunk-T6TWWATE.cjs');

// src/utils/math/decimals.spec.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _bignumberjs = require('bignumber.js');
_chunkDS2XYV5Gcjs.describe.call(void 0, "math/decimals", () => {
  _chunkDS2XYV5Gcjs.describe.call(void 0, "toDecimal", () => {
    _chunkDS2XYV5Gcjs.it.call(void 0, "should convert wei to decimal with default 18 decimals", () => {
      const wei = BigInt("1000000000000000000");
      const result = _chunkRUIKAUOAcjs.toDecimal.call(void 0, wei);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toBeInstanceOf(_bignumberjs.BigNumber);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result.toString()).toBe("1");
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should convert wei to decimal with custom decimals", () => {
      const wei = BigInt("1000000");
      const result = _chunkRUIKAUOAcjs.toDecimal.call(void 0, wei, 6);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result.toString()).toBe("1");
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should handle partial decimal values", () => {
      const wei = BigInt("1500000000000000000");
      const result = _chunkRUIKAUOAcjs.toDecimal.call(void 0, wei);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result.toString()).toBe("1.5");
    });
  });
  _chunkDS2XYV5Gcjs.describe.call(void 0, "toNumber", () => {
    _chunkDS2XYV5Gcjs.it.call(void 0, "should convert wei to number", () => {
      const wei = BigInt("1500000000000000000");
      const result = _chunkRUIKAUOAcjs.toNumber.call(void 0, wei);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, typeof result).toBe("number");
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toBe(1.5);
    });
  });
  _chunkDS2XYV5Gcjs.describe.call(void 0, "fromDecimal", () => {
    _chunkDS2XYV5Gcjs.it.call(void 0, "should convert number to wei", () => {
      const value = 1.5;
      const result = _chunkRUIKAUOAcjs.fromDecimal.call(void 0, value);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, typeof result).toBe("bigint");
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toBe(BigInt("1500000000000000000"));
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should convert BigNumber to wei", () => {
      const value = new (0, _bignumberjs.BigNumber)("1.5");
      const result = _chunkRUIKAUOAcjs.fromDecimal.call(void 0, value);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toBe(BigInt("1500000000000000000"));
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should handle custom decimals", () => {
      const value = 1;
      const result = _chunkRUIKAUOAcjs.fromDecimal.call(void 0, value, 6);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toBe(BigInt("1000000"));
    });
  });
  _chunkDS2XYV5Gcjs.describe.call(void 0, "toBigint", () => {
    _chunkDS2XYV5Gcjs.it.call(void 0, "should be an alias for fromDecimal", () => {
      const value = 1.5;
      const result = _chunkRUIKAUOAcjs.toBigint.call(void 0, value);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toBe(BigInt("1500000000000000000"));
    });
  });
});
//# sourceMappingURL=decimals.spec.cjs.map