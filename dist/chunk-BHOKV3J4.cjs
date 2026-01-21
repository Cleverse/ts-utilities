"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk5JHPDOVLcjs = require('./chunk-5JHPDOVL.cjs');

// src/types/Env/index.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
var _zod = require('zod');
var Environment = _zod.z.enum(["local", "development", "production"]).default("development");



exports.Environment = Environment;
//# sourceMappingURL=chunk-BHOKV3J4.cjs.map