import { VError } from "verror";
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
        throw new VError(error, `Failed to parse JSONL line[${currentLine}]`);
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
      throw new VError(error, `Failed to parse final JSONL line[${currentLine}]`);
    }
  }
}
export {
  jsonlDecodeStream,
  jsonlDecodeStreamAsync
};
//# sourceMappingURL=jsonl.js.map