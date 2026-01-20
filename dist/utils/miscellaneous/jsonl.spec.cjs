"use strict";



var _chunkXDMBOPPTcjs = require('../../chunk-XDMBOPPT.cjs');



var _chunkCU6LCS3Zcjs = require('../../chunk-CU6LCS3Z.cjs');


var _chunk5JHPDOVLcjs = require('../../chunk-5JHPDOVL.cjs');

// src/utils/miscellaneous/jsonl.spec.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
_chunkXDMBOPPTcjs.describe.call(void 0, "miscellaneous/jsonl", () => {
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
  _chunkXDMBOPPTcjs.describe.call(void 0, "jsonlDecodeStreamAsync", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should decode valid JSONL stream", async () => {
      const chunks = ['{"id":1}\n{"id":2}\n', '{"id":3}'];
      const stream = createStream(chunks);
      const result = [];
      for await (const item of _chunkCU6LCS3Zcjs.jsonlDecodeStreamAsync.call(void 0, stream)) {
        result.push(item);
      }
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should handle split lines across chunks", async () => {
      const chunks = ['{"id":1}\n{"id"', ':2}\n{"id":3}'];
      const stream = createStream(chunks);
      const result = [];
      for await (const item of _chunkCU6LCS3Zcjs.jsonlDecodeStreamAsync.call(void 0, stream)) {
        result.push(item);
      }
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should throw error on invalid JSON", async () => {
      const stream = createStream(['{"id":1}\ninvalid-json\n']);
      await _chunkXDMBOPPTcjs.globalExpect.call(void 0, async () => {
        for await (const _ of _chunkCU6LCS3Zcjs.jsonlDecodeStreamAsync.call(void 0, stream)) {
        }
      }).rejects.toThrow("Failed to parse JSONL line");
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should skip invalid lines if requested", async () => {
      const stream = createStream(['{"id":1}\ninvalid-json\n{"id":2}']);
      const result = [];
      for await (const item of _chunkCU6LCS3Zcjs.jsonlDecodeStreamAsync.call(void 0, stream, { skipInvalidLine: true })) {
        result.push(item);
      }
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "jsonlDecodeStream", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should decode stream to array", async () => {
      const stream = createStream(['{"a":1}\n{"b":2}']);
      const result = await _chunkCU6LCS3Zcjs.jsonlDecodeStream.call(void 0, stream);
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, result).toEqual([{ a: 1 }, { b: 2 }]);
    });
  });
});
//# sourceMappingURL=jsonl.spec.cjs.map