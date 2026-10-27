"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk2X3FSA3Bcjs = require('./chunk-2X3FSA3B.cjs');

// src/types/Utility/primitive.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var _zod = require('zod');
var PrimitiveValueSchema = _zod.z.union([_zod.z.string(), _zod.z.number(), _zod.z.boolean()]);
var PrimitiveSchema = _zod.z.union([PrimitiveValueSchema, _zod.z.null(), _zod.z.undefined()]);




exports.PrimitiveValueSchema = PrimitiveValueSchema; exports.PrimitiveSchema = PrimitiveSchema;
//# sourceMappingURL=chunk-4DWSMHHI.cjs.map