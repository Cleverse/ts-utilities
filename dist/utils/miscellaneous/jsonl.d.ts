/**
 * Decode a jsonl stream into an array of objects.
 */
declare function jsonlDecodeStream<T = any>(stream: ReadableStream<Uint8Array>): Promise<T[]>;
/**
 * Asynchronously decode a jsonl stream into an array of objects.
 */
declare function jsonlDecodeStreamAsync<T = any>(stream: ReadableStream, options?: {
    skipInvalidLine?: boolean;
}): AsyncIterableIterator<T>;

export { jsonlDecodeStream, jsonlDecodeStreamAsync };
