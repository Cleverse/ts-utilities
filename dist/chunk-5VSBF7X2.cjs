"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/types/Utility/primitive.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _zod = require('zod');
var PrimitiveValueSchema = _zod.z.union([_zod.z.string(), _zod.z.number(), _zod.z.boolean()]);
var PrimitiveSchema = _zod.z.union([PrimitiveValueSchema, _zod.z.null(), _zod.z.undefined()]);




exports.PrimitiveValueSchema = PrimitiveValueSchema; exports.PrimitiveSchema = PrimitiveSchema;
//# sourceMappingURL=chunk-5VSBF7X2.cjs.map