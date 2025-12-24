/**
 * Read whole stream to a string utf-8
 * @param stream - The ReadableStream to read from
 * @returns Promise that resolves to the string content
 */
export async function streamToString(stream: ReadableStream): Promise<string> {
	/*
	  // Alternative way - can control or break while reading
		const reader = stream.pipeThrough(new TextDecoderStream())
		const parts: string[] = [];
		for await (const chunk of reader) {
			parts.push(chunk)
		}
		return parts.join('')
	 */
	return await new Response(stream).text() // high efficiency read whole stream
}
