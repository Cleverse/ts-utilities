"use strict";


var _chunkEYW4TGSOcjs = require('../../chunk-EYW4TGSO.cjs');




var _chunkDS2XYV5Gcjs = require('../../chunk-DS2XYV5G.cjs');


var _chunkT6TWWATEcjs = require('../../chunk-T6TWWATE.cjs');

// src/utils/miscellaneous/jsonl.spec.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
_chunkDS2XYV5Gcjs.describe.call(void 0, "miscellaneous/jsonl", () => {
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
  _chunkDS2XYV5Gcjs.describe.call(void 0, "jsonlDecodeStreamAsync", () => {
    _chunkDS2XYV5Gcjs.it.call(void 0, "should decode valid JSONL stream", async () => {
      const chunks = ['{"id":1}\n{"id":2}\n', '{"id":3}'];
      const stream = createStream(chunks);
      const result = [];
      for await (const item of _chunkEYW4TGSOcjs.jsonlDecodeStreamAsync.call(void 0, stream)) {
        result.push(item);
      }
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should handle split lines across chunks", async () => {
      const chunks = ['{"id":1}\n{"id"', ':2}\n{"id":3}'];
      const stream = createStream(chunks);
      const result = [];
      for await (const item of _chunkEYW4TGSOcjs.jsonlDecodeStreamAsync.call(void 0, stream)) {
        result.push(item);
      }
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should throw error on invalid JSON", async () => {
      const stream = createStream(['{"id":1}\ninvalid-json\n']);
      await _chunkDS2XYV5Gcjs.globalExpect.call(void 0, async () => {
        for await (const _ of _chunkEYW4TGSOcjs.jsonlDecodeStreamAsync.call(void 0, stream)) {
        }
      }).rejects.toThrow("Failed to parse JSONL line");
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should skip invalid lines if requested", async () => {
      const stream = createStream(['{"id":1}\ninvalid-json\n{"id":2}']);
      const result = [];
      for await (const item of _chunkEYW4TGSOcjs.jsonlDecodeStreamAsync.call(void 0, stream, { skipInvalidLine: true })) {
        result.push(item);
      }
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });
  _chunkDS2XYV5Gcjs.describe.call(void 0, "jsonlDecodeStream", () => {
    _chunkDS2XYV5Gcjs.it.call(void 0, "should decode stream to array", async () => {
      const stream = createStream(['{"a":1}\n{"b":2}']);
      const result = await _chunkEYW4TGSOcjs.jsonlDecodeStream.call(void 0, stream);
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, result).toEqual([{ a: 1 }, { b: 2 }]);
    });
  });
});
//# sourceMappingURL=jsonl.spec.cjs.map