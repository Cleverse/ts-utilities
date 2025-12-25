async function streamToString(stream) {
  return await new Response(stream).text();
}
export {
  streamToString
};
//# sourceMappingURL=stream.js.map