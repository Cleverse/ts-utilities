// src/utils/miscellaneous/stream.ts
async function streamToString(stream) {
  return await new Response(stream).text();
}

export {
  streamToString
};
//# sourceMappingURL=chunk-7BGUB3O5.js.map