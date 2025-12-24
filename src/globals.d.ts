/* eslint-disable @typescript-eslint/no-explicit-any */
export {}

declare global {
	/** NOTE: Fix AsyncIterator issues when tsconfig.lib was have `DOM` or `DOM.Iterable` */
	interface ReadableStream<R = any> {
		[Symbol.asyncIterator](): AsyncIterator<R>
	}
}
