"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk2X3FSA3Bcjs = require('./chunk-2X3FSA3B.cjs');

// src/utils/miscellaneous/stream.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
async function streamToString(stream) {
  return await new Response(stream).text();
}



exports.streamToString = streamToString;
//# sourceMappingURL=chunk-JALEZXJV.cjs.map