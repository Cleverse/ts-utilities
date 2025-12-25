"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var jsonl_exports = {};
__export(jsonl_exports, {
  jsonlDecodeStream: () => jsonlDecodeStream,
  jsonlDecodeStreamAsync: () => jsonlDecodeStreamAsync
});
module.exports = __toCommonJS(jsonl_exports);
var import_verror = require("verror");
async function jsonlDecodeStream(stream) {
  return Array.fromAsync(jsonlDecodeStreamAsync(stream));
}
async function* jsonlDecodeStreamAsync(stream, options) {
  const reader = stream.pipeThrough(new TextDecoderStream());
  let memory = "";
  let currentLine = 0;
  for await (const chunk of reader) {
    memory += chunk;
    const lines = memory.split("\n");
    memory = lines.pop() ?? "";
    for (const line of lines) {
      if (line.trim() === "") continue;
      try {
        const parsed = JSON.parse(line);
        yield parsed;
      } catch (error) {
        if (options?.skipInvalidLine) continue;
        throw new import_verror.VError(error, `Failed to parse JSONL line[${currentLine}]`);
      } finally {
        currentLine++;
      }
    }
  }
  if (memory.trim() !== "") {
    try {
      const parsed = JSON.parse(memory);
      yield parsed;
    } catch (error) {
      if (options?.skipInvalidLine) return;
      throw new import_verror.VError(error, `Failed to parse final JSONL line[${currentLine}]`);
    }
  }
}
//# sourceMappingURL=jsonl.cjs.map