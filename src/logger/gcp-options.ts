import type { Level, LoggerOptions } from "pino"

// Map Pino levels to Google Cloud Logging severity levels
// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
const levelToSeverity: Record<Level, string> = {
	trace: "DEBUG",
	debug: "DEBUG",
	info: "INFO",
	warn: "WARNING",
	error: "ERROR",
	fatal: "CRITICAL",
}

// https://cloud.google.com/logging/docs/structured-logging#special-payload-fields
export const gcpPinoLoggerOptions: LoggerOptions = {
	messageKey: "message",
	formatters: {
		level(label: string) {
			const pinoLevel = label as Level
			const severity = levelToSeverity[pinoLevel]
			// `@type` property tells Error Reporting to track even if there is no `stack_trace`
			// https://cloud.google.com/error-reporting/docs/formatting-error-messages#log-text
			const typeProp =
				pinoLevel === "error" || pinoLevel === "fatal"
					? {
							"@type": "type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent",
						}
					: {}
			return { severity, ...typeProp }
		},

		log(object) {
			// add stack_trace field to object, if exists. ref: https://cloud.google.com/error-reporting/docs/formatting-error-messages#format-log-entry
			const logObject = object as { err?: Error }
			const stackTrace = logObject.err?.stack
			const stackProp = stackTrace ? { stack_trace: stackTrace } : {}
			return { ...object, ...stackProp }
		},
	},
}
