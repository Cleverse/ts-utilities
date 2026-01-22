"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/utils/miscellaneous/json.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _superjson = require('superjson'); var superjson = _interopRequireWildcard(_superjson);
function toJSONObject(obj) {
  if (obj === null || obj === void 0) {
    return {};
  }
  const { json } = superjson.serialize(obj);
  return json;
}



exports.toJSONObject = toJSONObject;
//# sourceMappingURL=chunk-PDMTOO67.cjs.map