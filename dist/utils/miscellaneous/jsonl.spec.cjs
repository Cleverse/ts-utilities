"use strict";


var _chunkACZ4O3DDcjs = require('../../chunk-ACZ4O3DD.cjs');




var _chunkBFR6AXPAcjs = require('../../chunk-BFR6AXPA.cjs');


var _chunk2X3FSA3Bcjs = require('../../chunk-2X3FSA3B.cjs');

// src/utils/miscellaneous/jsonl.spec.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
_chunkBFR6AXPAcjs.describe.call(void 0, "miscellaneous/jsonl", () => {
  const createStream = (chunks) => {
    return new ReadableStream({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      }
    });
  };
  _chunkBFR6AXPAcjs.describe.call(void 0, "jsonlDecodeStreamAsync", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should decode valid JSONL stream", async () => {
      const chunks = ['{"id":1}\n{"id":2}\n', '{"id":3}'];
      const stream = createStream(chunks);
      const result = [];
      for await (const item of _chunkACZ4O3DDcjs.jsonlDecodeStreamAsync.call(void 0, stream)) {
        result.push(item);
      }
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should handle split lines across chunks", async () => {
      const chunks = ['{"id":1}\n{"id"', ':2}\n{"id":3}'];
      const stream = createStream(chunks);
      const result = [];
      for await (const item of _chunkACZ4O3DDcjs.jsonlDecodeStreamAsync.call(void 0, stream)) {
        result.push(item);
      }
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should throw error on invalid JSON", async () => {
      const stream = createStream(['{"id":1}\ninvalid-json\n']);
      await _chunkBFR6AXPAcjs.globalExpect.call(void 0, async () => {
        for await (const _ of _chunkACZ4O3DDcjs.jsonlDecodeStreamAsync.call(void 0, stream)) {
        }
      }).rejects.toThrow("Failed to parse JSONL line");
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should skip invalid lines if requested", async () => {
      const stream = createStream(['{"id":1}\ninvalid-json\n{"id":2}']);
      const result = [];
      for await (const item of _chunkACZ4O3DDcjs.jsonlDecodeStreamAsync.call(void 0, stream, { skipInvalidLine: true })) {
        result.push(item);
      }
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "jsonlDecodeStream", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should decode stream to array", async () => {
      const stream = createStream(['{"a":1}\n{"b":2}']);
      const result = await _chunkACZ4O3DDcjs.jsonlDecodeStream.call(void 0, stream);
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, result).toEqual([{ a: 1 }, { b: 2 }]);
    });
  });
});
//# sourceMappingURL=jsonl.spec.cjs.map