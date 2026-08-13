"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk5VSBF7X2cjs = require('./chunk-5VSBF7X2.cjs');


var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/types/Utility/json.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _zod = require('zod');
var JSONValueSchema = _zod.z.lazy(
  () => _zod.z.union([_zod.z.null(), _chunk5VSBF7X2cjs.PrimitiveValueSchema, JSONObjectSchema, JSONArraySchema])
);
var JSONObjectSchema = _zod.z.lazy(() => _zod.z.record(_zod.z.string(), JSONValueSchema));
var JSONArraySchema = _zod.z.lazy(() => _zod.z.array(JSONValueSchema));





exports.JSONValueSchema = JSONValueSchema; exports.JSONObjectSchema = JSONObjectSchema; exports.JSONArraySchema = JSONArraySchema;
//# sourceMappingURL=chunk-LEHDDVF3.cjs.map