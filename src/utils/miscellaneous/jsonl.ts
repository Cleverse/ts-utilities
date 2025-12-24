/* eslint-disable @typescript-eslint/no-explicit-any */
import { VError } from "verror"

/**
 * Decode a jsonl stream into an array of objects.
 */
export async function jsonlDecodeStream<T = any>(stream: ReadableStream<Uint8Array>): Promise<T[]> {
	// or use `await new Response(stream).text()` and jsonl.parse(string) instead.
	return Array.fromAsync(jsonlDecodeStreamAsync(stream))
}

/**
 * Asynchronously decode a jsonl stream into an array of objects.
 */
export async function* jsonlDecodeStreamAsync<T = any>(
	stream: ReadableStream,
	options?: {
		skipInvalidLine?: boolean
	},
): AsyncIterableIterator<T> {
	const reader = stream.pipeThrough(new TextDecoderStream())
	let memory = ""
	let currentLine = 0
	for await (const chunk of reader) {
		memory += chunk
		const lines = memory.split("\n")
		memory = lines.pop() ?? "" // Keep the last line (might be incomplete)

		for (const line of lines) {
			if (line.trim() === "") continue

			try {
				const parsed = JSON.parse(line) as T
				yield parsed
			} catch (error) {
				if (options?.skipInvalidLine) continue
				throw new VError(error as Error, `Failed to parse JSONL line[${currentLine}]`)
			} finally {
				currentLine++
			}
		}
	}
	if (memory.trim() !== "") {
		try {
			const parsed = JSON.parse(memory) as T
			yield parsed
		} catch (error) {
			if (options?.skipInvalidLine) return
			throw new VError(error as Error, `Failed to parse final JSONL line[${currentLine}]`)
		}
	}
}
