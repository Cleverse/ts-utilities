"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunk5JHPDOVLcjs = require('./chunk-5JHPDOVL.cjs');

// src/utils/time/ms.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
var _prettyms = require('pretty-ms'); var _prettyms2 = _interopRequireDefault(_prettyms);
var DEFAULT_MS_OPTIONS = {
  secondsDecimalDigits: 3,
  millisecondsDecimalDigits: 3
};
var ms = (ms2, options) => {
  return _prettyms2.default.call(void 0, ms2, {
    ...DEFAULT_MS_OPTIONS,
    ...options
  });
};
var ms_default = ms;




exports.ms = ms; exports.ms_default = ms_default;
//# sourceMappingURL=chunk-FQ7GXMHF.cjs.map