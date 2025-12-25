import { describe, expect, it } from "vitest";
import { jsonlDecodeStream, jsonlDecodeStreamAsync } from "./jsonl";
describe("miscellaneous/jsonl", () => {
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
  describe("jsonlDecodeStreamAsync", () => {
    it("should decode valid JSONL stream", async () => {
      const chunks = ['{"id":1}\n{"id":2}\n', '{"id":3}'];
      const stream = createStream(chunks);
      const result = [];
      for await (const item of jsonlDecodeStreamAsync(stream)) {
        result.push(item);
      }
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
    it("should handle split lines across chunks", async () => {
      const chunks = ['{"id":1}\n{"id"', ':2}\n{"id":3}'];
      const stream = createStream(chunks);
      const result = [];
      for await (const item of jsonlDecodeStreamAsync(stream)) {
        result.push(item);
      }
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
    it("should throw error on invalid JSON", async () => {
      const stream = createStream(['{"id":1}\ninvalid-json\n']);
      await expect(async () => {
        for await (const _ of jsonlDecodeStreamAsync(stream)) {
        }
      }).rejects.toThrow("Failed to parse JSONL line");
    });
    it("should skip invalid lines if requested", async () => {
      const stream = createStream(['{"id":1}\ninvalid-json\n{"id":2}']);
      const result = [];
      for await (const item of jsonlDecodeStreamAsync(stream, { skipInvalidLine: true })) {
        result.push(item);
      }
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });
  describe("jsonlDecodeStream", () => {
    it("should decode stream to array", async () => {
      const stream = createStream(['{"a":1}\n{"b":2}']);
      const result = await jsonlDecodeStream(stream);
      expect(result).toEqual([{ a: 1 }, { b: 2 }]);
    });
  });
});
//# sourceMappingURL=jsonl.spec.js.map