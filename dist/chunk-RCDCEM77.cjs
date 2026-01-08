"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk5JHPDOVLcjs = require('./chunk-5JHPDOVL.cjs');

// src/utils/miscellaneous/stream.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
async function streamToString(stream) {
  return await new Response(stream).text();
}



exports.streamToString = streamToString;
//# sourceMappingURL=chunk-RCDCEM77.cjs.map