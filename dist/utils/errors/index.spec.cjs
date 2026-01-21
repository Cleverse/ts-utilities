"use strict";



var _chunkXDMBOPPTcjs = require('../../chunk-XDMBOPPT.cjs');


var _chunkX2LBWM7Icjs = require('../../chunk-X2LBWM7I.cjs');


var _chunk5JHPDOVLcjs = require('../../chunk-5JHPDOVL.cjs');

// src/utils/errors/index.spec.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
var _verror = require('verror');
_chunkXDMBOPPTcjs.describe.call(void 0, "errors", () => {
  class CustomError extends Error {
    constructor(message) {
      super(message);
      this.name = "CustomError";
    }
  }
  _chunkXDMBOPPTcjs.describe.call(void 0, "find", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should find error in simple cause chain", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      const found = _chunkX2LBWM7Icjs.errors.find(err, CustomError);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, found).toBe(root);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, found).toBeInstanceOf(CustomError);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should find error in VError chain", () => {
      const root = new CustomError("root");
      const err = new (0, _verror.VError)(root, "wrapper");
      const found = _chunkX2LBWM7Icjs.errors.find(err, CustomError);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, found).toBe(root);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should return undefined if not found", () => {
      const err = new Error("simple");
      const found = _chunkX2LBWM7Icjs.errors.find(err, CustomError);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, found).toBeUndefined();
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "is", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should return true if error matches type in chain", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkX2LBWM7Icjs.errors.is(err, CustomError)).toBe(true);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should return false if error not found in chain", () => {
      const err = new Error("simple");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkX2LBWM7Icjs.errors.is(err, CustomError)).toBe(false);
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "as", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should return true and narrow type if direct instance", () => {
      const err = new CustomError("test");
      if (_chunkX2LBWM7Icjs.errors.as(err, CustomError)) {
        _chunkXDMBOPPTcjs.globalExpect.call(void 0, err.message).toBe("test");
      } else {
        throw new Error("should be CustomError");
      }
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should return false if not direct instance", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkX2LBWM7Icjs.errors.as(err, CustomError)).toBe(false);
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "unwrap", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should unwrap simple cause", () => {
      const root = new Error("root");
      const err = new Error("wrapper", { cause: root });
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkX2LBWM7Icjs.errors.unwrap(err)).toBe(root);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should unwrap VError cause", () => {
      const root = new Error("root");
      const err = new (0, _verror.VError)(root, "wrapper");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkX2LBWM7Icjs.errors.unwrap(err)).toBe(root);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should return undefined if no cause", () => {
      const err = new Error("simple");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, _chunkX2LBWM7Icjs.errors.unwrap(err)).toBeUndefined();
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "join", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should join multiple errors into MultiError", () => {
      const err1 = new Error("one");
      const err2 = new Error("two");
      const joined = _chunkX2LBWM7Icjs.errors.join([err1, err2]);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, joined).toBeInstanceOf(_verror.VError.MultiError);
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map