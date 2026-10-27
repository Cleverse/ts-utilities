"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk4DWSMHHIcjs = require('./chunk-4DWSMHHI.cjs');


var _chunk2X3FSA3Bcjs = require('./chunk-2X3FSA3B.cjs');

// src/types/Utility/json.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var _zod = require('zod');
var JSONValueSchema = _zod.z.lazy(
  () => _zod.z.union([_zod.z.null(), _chunk4DWSMHHIcjs.PrimitiveValueSchema, JSONObjectSchema, JSONArraySchema])
);
var JSONObjectSchema = _zod.z.lazy(() => _zod.z.record(_zod.z.string(), JSONValueSchema));
var JSONArraySchema = _zod.z.lazy(() => _zod.z.array(JSONValueSchema));





exports.JSONValueSchema = JSONValueSchema; exports.JSONObjectSchema = JSONObjectSchema; exports.JSONArraySchema = JSONArraySchema;
//# sourceMappingURL=chunk-WAZPJZUX.cjs.map