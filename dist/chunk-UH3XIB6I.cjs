"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/utils/miscellaneous/stream.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
async function streamToString(stream) {
  return await new Response(stream).text();
}



exports.streamToString = streamToString;
//# sourceMappingURL=chunk-UH3XIB6I.cjs.map