/**
 * Read whole stream to a string utf-8
 * @param stream - The ReadableStream to read from
 * @returns Promise that resolves to the string content
 */
declare function streamToString(stream: ReadableStream): Promise<string>;

export { streamToString };
