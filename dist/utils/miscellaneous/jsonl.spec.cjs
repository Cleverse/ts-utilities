"use strict";
var import_vitest = require("vitest");
var import_jsonl = require("./jsonl");
(0, import_vitest.describe)("miscellaneous/jsonl", () => {
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
  (0, import_vitest.describe)("jsonlDecodeStreamAsync", () => {
    (0, import_vitest.it)("should decode valid JSONL stream", async () => {
      const chunks = ['{"id":1}\n{"id":2}\n', '{"id":3}'];
      const stream = createStream(chunks);
      const result = [];
      for await (const item of (0, import_jsonl.jsonlDecodeStreamAsync)(stream)) {
        result.push(item);
      }
      (0, import_vitest.expect)(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
    (0, import_vitest.it)("should handle split lines across chunks", async () => {
      const chunks = ['{"id":1}\n{"id"', ':2}\n{"id":3}'];
      const stream = createStream(chunks);
      const result = [];
      for await (const item of (0, import_jsonl.jsonlDecodeStreamAsync)(stream)) {
        result.push(item);
      }
      (0, import_vitest.expect)(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
    (0, import_vitest.it)("should throw error on invalid JSON", async () => {
      const stream = createStream(['{"id":1}\ninvalid-json\n']);
      await (0, import_vitest.expect)(async () => {
        for await (const _ of (0, import_jsonl.jsonlDecodeStreamAsync)(stream)) {
        }
      }).rejects.toThrow("Failed to parse JSONL line");
    });
    (0, import_vitest.it)("should skip invalid lines if requested", async () => {
      const stream = createStream(['{"id":1}\ninvalid-json\n{"id":2}']);
      const result = [];
      for await (const item of (0, import_jsonl.jsonlDecodeStreamAsync)(stream, { skipInvalidLine: true })) {
        result.push(item);
      }
      (0, import_vitest.expect)(result).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });
  (0, import_vitest.describe)("jsonlDecodeStream", () => {
    (0, import_vitest.it)("should decode stream to array", async () => {
      const stream = createStream(['{"a":1}\n{"b":2}']);
      const result = await (0, import_jsonl.jsonlDecodeStream)(stream);
      (0, import_vitest.expect)(result).toEqual([{ a: 1 }, { b: 2 }]);
    });
  });
});
//# sourceMappingURL=jsonl.spec.cjs.map