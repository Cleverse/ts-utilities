"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk2X3FSA3Bcjs = require('./chunk-2X3FSA3B.cjs');

// src/types/Env/index.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var _zod = require('zod');
var Environment = _zod.z.enum(["local", "development", "production"]).default("development");



exports.Environment = Environment;
//# sourceMappingURL=chunk-CQURMC6I.cjs.map