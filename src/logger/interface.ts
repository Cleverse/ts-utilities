export type Bindings = Record<string, unknown>

export type MergingObject<T extends {} = {}> = {
	[key: string]: unknown

	/**
	 * Error stack trace will be included in the log.
	 */
	err?: Error | unknown
} & T

export type LogFn<T extends {} = {}> = (message: string, mergingObject?: MergingObject<T>) => void
export type RequiredLogFn<T extends {} = {}> = (message: string, mergingObject: MergingObject<T>) => void

export interface ILogger {
	child(bindings: Bindings): ILogger
	with(bindings: Bindings): ILogger
	fatal: LogFn
	error: RequiredLogFn<{
		/**
		 * Always include `event` name for log level `ERROR` | `WARN`
		 */
		event: string
		/**
		 * Error stack trace will be included in the log.
		 */
		err: Error | unknown
	}>
	warn: RequiredLogFn<{
		/**
		 * Always include `event` name for log level `ERROR` | `WARN`
		 */
		event: string
	}>
	info: LogFn
	debug: LogFn
	trace: LogFn

	/**
	 * Noop function.
	 */
	silent: LogFn
}
export type Logger = ILogger
