"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunk6PFTR7WZcjs = require('../../chunk-6PFTR7WZ.cjs');




var _chunkBFR6AXPAcjs = require('../../chunk-BFR6AXPA.cjs');


var _chunk2X3FSA3Bcjs = require('../../chunk-2X3FSA3B.cjs');

// src/utils/errors/index.spec.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var _verror = require('verror'); var _verror2 = _interopRequireDefault(_verror);
_chunkBFR6AXPAcjs.describe.call(void 0, "errors", () => {
  class CustomError extends Error {
    constructor(message) {
      super(message);
      this.name = "CustomError";
    }
  }
  _chunkBFR6AXPAcjs.describe.call(void 0, "find", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should find error in simple cause chain", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      const found = _chunk6PFTR7WZcjs.errors.find(err, CustomError);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, found).toBe(root);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, found).toBeInstanceOf(CustomError);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should find error in VError chain", () => {
      const root = new CustomError("root");
      const err = new (0, _verror2.default)(root, "wrapper");
      const found = _chunk6PFTR7WZcjs.errors.find(err, CustomError);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, found).toBe(root);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should return undefined if not found", () => {
      const err = new Error("simple");
      const found = _chunk6PFTR7WZcjs.errors.find(err, CustomError);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, found).toBeUndefined();
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "is", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should return true if error matches type in chain", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunk6PFTR7WZcjs.errors.is(err, CustomError)).toBe(true);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should return false if error not found in chain", () => {
      const err = new Error("simple");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunk6PFTR7WZcjs.errors.is(err, CustomError)).toBe(false);
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "as", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should return true and narrow type if direct instance", () => {
      const err = new CustomError("test");
      if (_chunk6PFTR7WZcjs.errors.as(err, CustomError)) {
        _chunkBFR6AXPAcjs.globalExpect.call(void 0, err.message).toBe("test");
      } else {
        throw new Error("should be CustomError");
      }
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should return false if not direct instance", () => {
      const root = new CustomError("root");
      const err = new Error("wrapper", { cause: root });
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunk6PFTR7WZcjs.errors.as(err, CustomError)).toBe(false);
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "unwrap", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should unwrap simple cause", () => {
      const root = new Error("root");
      const err = new Error("wrapper", { cause: root });
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunk6PFTR7WZcjs.errors.unwrap(err)).toBe(root);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should unwrap VError cause", () => {
      const root = new Error("root");
      const err = new (0, _verror2.default)(root, "wrapper");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunk6PFTR7WZcjs.errors.unwrap(err)).toBe(root);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should return undefined if no cause", () => {
      const err = new Error("simple");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, _chunk6PFTR7WZcjs.errors.unwrap(err)).toBeUndefined();
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "join", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should join multiple errors into MultiError", () => {
      const err1 = new Error("one");
      const err2 = new Error("two");
      const joined = _chunk6PFTR7WZcjs.errors.join([err1, err2]);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, joined).toBeInstanceOf(_verror2.default.MultiError);
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map