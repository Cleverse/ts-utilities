"use strict";




var _chunkIW5VJ6LJcjs = require('../../chunk-IW5VJ6LJ.cjs');




var _chunkXDMBOPPTcjs = require('../../chunk-XDMBOPPT.cjs');


var _chunk5JHPDOVLcjs = require('../../chunk-5JHPDOVL.cjs');

// src/utils/math/decimals.spec.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
var _bignumberjs = require('bignumber.js');
_chunkXDMBOPPTcjs.describe.call(void 0, "math/decimals", () => {
  _chunkXDMBOPPTcjs.describe.call(void 0, "toDecimal", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should convert wei to decimal with default 18 decimals", () => {
      const wei = BigInt("1000000000000000000");
      const result = _chunkIW5VJ6LJcjs.toDecimal.call(void 0, wei);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toBeInstanceOf(_bignumberjs.BigNumber);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.toString()).toBe("1");
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should convert wei to decimal with custom decimals", () => {
      const wei = BigInt("1000000");
      const result = _chunkIW5VJ6LJcjs.toDecimal.call(void 0, wei, 6);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.toString()).toBe("1");
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should handle partial decimal values", () => {
      const wei = BigInt("1500000000000000000");
      const result = _chunkIW5VJ6LJcjs.toDecimal.call(void 0, wei);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result.toString()).toBe("1.5");
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "toNumber", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should convert wei to number", () => {
      const wei = BigInt("1500000000000000000");
      const result = _chunkIW5VJ6LJcjs.toNumber.call(void 0, wei);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, typeof result).toBe("number");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toBe(1.5);
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "fromDecimal", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should convert number to wei", () => {
      const value = 1.5;
      const result = _chunkIW5VJ6LJcjs.fromDecimal.call(void 0, value);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, typeof result).toBe("bigint");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toBe(BigInt("1500000000000000000"));
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should convert BigNumber to wei", () => {
      const value = new (0, _bignumberjs.BigNumber)("1.5");
      const result = _chunkIW5VJ6LJcjs.fromDecimal.call(void 0, value);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toBe(BigInt("1500000000000000000"));
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should handle custom decimals", () => {
      const value = 1;
      const result = _chunkIW5VJ6LJcjs.fromDecimal.call(void 0, value, 6);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toBe(BigInt("1000000"));
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "toBigint", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should be an alias for fromDecimal", () => {
      const value = 1.5;
      const result = _chunkIW5VJ6LJcjs.toBigint.call(void 0, value);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toBe(BigInt("1500000000000000000"));
    });
  });
});
//# sourceMappingURL=decimals.spec.cjs.map