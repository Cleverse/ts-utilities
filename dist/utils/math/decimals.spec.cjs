"use strict";




var _chunkWHM72NDAcjs = require('../../chunk-WHM72NDA.cjs');




var _chunkBFR6AXPAcjs = require('../../chunk-BFR6AXPA.cjs');


var _chunk2X3FSA3Bcjs = require('../../chunk-2X3FSA3B.cjs');

// src/utils/math/decimals.spec.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var _bignumberjs = require('bignumber.js');
_chunkBFR6AXPAcjs.describe.call(void 0, "math/decimals", () => {
  _chunkBFR6AXPAcjs.describe.call(void 0, "toDecimal", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should convert wei to decimal with default 18 decimals", () => {
      const wei = BigInt("1000000000000000000");
      const result = _chunkWHM72NDAcjs.toDecimal.call(void 0, wei);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toBeInstanceOf(_bignumberjs.BigNumber);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.toString()).toBe("1");
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should convert wei to decimal with custom decimals", () => {
      const wei = BigInt("1000000");
      const result = _chunkWHM72NDAcjs.toDecimal.call(void 0, wei, 6);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.toString()).toBe("1");
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should handle partial decimal values", () => {
      const wei = BigInt("1500000000000000000");
      const result = _chunkWHM72NDAcjs.toDecimal.call(void 0, wei);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result.toString()).toBe("1.5");
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "toNumber", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should convert wei to number", () => {
      const wei = BigInt("1500000000000000000");
      const result = _chunkWHM72NDAcjs.toNumber.call(void 0, wei);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, typeof result).toBe("number");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toBe(1.5);
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "fromDecimal", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should convert number to wei", () => {
      const value = 1.5;
      const result = _chunkWHM72NDAcjs.fromDecimal.call(void 0, value);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, typeof result).toBe("bigint");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toBe(BigInt("1500000000000000000"));
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should convert BigNumber to wei", () => {
      const value = new (0, _bignumberjs.BigNumber)("1.5");
      const result = _chunkWHM72NDAcjs.fromDecimal.call(void 0, value);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toBe(BigInt("1500000000000000000"));
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should handle custom decimals", () => {
      const value = 1;
      const result = _chunkWHM72NDAcjs.fromDecimal.call(void 0, value, 6);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toBe(BigInt("1000000"));
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "toBigint", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should be an alias for fromDecimal", () => {
      const value = 1.5;
      const result = _chunkWHM72NDAcjs.toBigint.call(void 0, value);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toBe(BigInt("1500000000000000000"));
    });
  });
});
//# sourceMappingURL=decimals.spec.cjs.map