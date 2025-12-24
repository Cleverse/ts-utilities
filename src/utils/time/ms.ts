import prettyMs, { type Options } from "pretty-ms"

const DEFAULT_MS_OPTIONS: Options = {
	secondsDecimalDigits: 3,
	millisecondsDecimalDigits: 3,
}

export const ms = (ms: number, options?: Options) => {
	return prettyMs(ms, {
		...DEFAULT_MS_OPTIONS,
		...options,
	})
}
export default ms
