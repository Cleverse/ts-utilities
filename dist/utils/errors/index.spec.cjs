"use strict";

var _chunkRWHWC4QPcjs = require('../../chunk-RWHWC4QP.cjs');




var _chunk5BHWYHGYcjs = require('../../chunk-5BHWYHGY.cjs');


var _chunkT6TWWATEcjs = require('../../chunk-T6TWWATE.cjs');

// src/utils/errors/index.spec.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _verror = require('verror');
_chunk5BHWYHGYcjs.describe.call(void 0, "errors", () => {
  class CustomError extends Error {
    constructor(message) {
      super(message);
      this.name = "CustomError";
    }
  }
  _chunk5BHWYHGYcjs.describe.call(void 0, "find", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should find error in simple cause chain", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      const found = _chunkRWHWC4QPcjs.errors.find(err, CustomError);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, found).toBe(root);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, found).toBeInstanceOf(CustomError);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should find error in VError chain", () => {
      const root = new CustomError("root");
      const err = new (0, _verror.VError)(root, "wrapper");
      const found = _chunkRWHWC4QPcjs.errors.find(err, CustomError);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, found).toBe(root);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should return undefined if not found", () => {
      const err = new Error("simple");
      const found = _chunkRWHWC4QPcjs.errors.find(err, CustomError);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, found).toBeUndefined();
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "is", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should return true if error matches type in chain", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkRWHWC4QPcjs.errors.is(err, CustomError)).toBe(true);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should return false if error not found in chain", () => {
      const err = new Error("simple");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkRWHWC4QPcjs.errors.is(err, CustomError)).toBe(false);
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "as", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should return true and narrow type if direct instance", () => {
      const err = new CustomError("test");
      if (_chunkRWHWC4QPcjs.errors.as(err, CustomError)) {
        _chunk5BHWYHGYcjs.globalExpect.call(void 0, err.message).toBe("test");
      } else {
        throw new Error("should be CustomError");
      }
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should return false if not direct instance", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkRWHWC4QPcjs.errors.as(err, CustomError)).toBe(false);
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "unwrap", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should unwrap simple cause", () => {
      const root = new Error("root");
      const err = new Error("wrapper", { cause: root });
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkRWHWC4QPcjs.errors.unwrap(err)).toBe(root);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should unwrap VError cause", () => {
      const root = new Error("root");
      const err = new (0, _verror.VError)(root, "wrapper");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkRWHWC4QPcjs.errors.unwrap(err)).toBe(root);
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should return undefined if no cause", () => {
      const err = new Error("simple");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, _chunkRWHWC4QPcjs.errors.unwrap(err)).toBeUndefined();
    });
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "join", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should join multiple errors into MultiError", () => {
      const err1 = new Error("one");
      const err2 = new Error("two");
      const joined = _chunkRWHWC4QPcjs.errors.join([err1, err2]);
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, joined).toBeInstanceOf(_verror.VError.MultiError);
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map