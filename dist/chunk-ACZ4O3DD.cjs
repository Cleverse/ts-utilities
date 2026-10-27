"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunk2X3FSA3Bcjs = require('./chunk-2X3FSA3B.cjs');

// src/utils/miscellaneous/jsonl.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var _verror = require('verror'); var _verror2 = _interopRequireDefault(_verror);
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
    memory = _nullishCoalesce(lines.pop(), () => ( ""));
    for (const line of lines) {
      if (line.trim() === "") continue;
      try {
        const parsed = JSON.parse(line);
        yield parsed;
      } catch (error) {
        if (_optionalChain([options, 'optionalAccess', _ => _.skipInvalidLine])) continue;
        throw new (0, _verror2.default)(error, `Failed to parse JSONL line[${currentLine}]`);
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
      if (_optionalChain([options, 'optionalAccess', _2 => _2.skipInvalidLine])) return;
      throw new (0, _verror2.default)(error, `Failed to parse final JSONL line[${currentLine}]`);
    }
  }
}




exports.jsonlDecodeStream = jsonlDecodeStream; exports.jsonlDecodeStreamAsync = jsonlDecodeStreamAsync;
//# sourceMappingURL=chunk-ACZ4O3DD.cjs.map