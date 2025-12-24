import pino from "pino"

import { gcpPinoLoggerOptions } from "./gcp-options"
import { Bindings, ILogger, MergingObject } from "./interface"

import type { LoggerOptions } from "pino"

type Environment = "local" | "development" | "production"

const loggerOptions: Record<Environment, LoggerOptions> = {
	local: {
		level: process.env.LOG_LEVEL || "trace",
		messageKey: "message",
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pid,hostname",
			},
		},
	},
	development: {
		level: process.env.LOG_LEVEL || "debug",

		...gcpPinoLoggerOptions,
	},
	production: {
		level: process.env.LOG_LEVEL || "info",
		...gcpPinoLoggerOptions,
	},
}

export class PinoAdapter implements ILogger {
	// Global default logger
	private static _logger = new PinoAdapter(
		pino(loggerOptions[process.env.ENVIRONMENT as Environment] ?? loggerOptions.local),
	)

	static get logger(): ILogger {
		return PinoAdapter._logger
	}

	// Initialize logger with given environment
	static init(env: Environment) {
		const pinoLogger = pino(loggerOptions[env])
		PinoAdapter._logger.set(pinoLogger)
		return [pinoLogger, PinoAdapter._logger] as const
	}

	// Create a new logger
	static new(pino: pino.Logger): ILogger {
		return new PinoAdapter(pino)
	}

	private constructor(private logger: pino.Logger) {}

	with(bindings: Bindings): ILogger {
		return new PinoAdapter(this.logger.child(bindings))
	}

	child(bindings: Bindings): ILogger {
		return new PinoAdapter(this.logger.child(bindings))
	}

	fatal(msg: string, obj?: MergingObject): void {
		this.logger.fatal(obj ?? {}, msg)
	}

	error(
		msg: string,
		obj: MergingObject<{
			event: string
			err: Error | unknown
		}>,
	): void {
		this.logger.error(obj ?? {}, msg)
	}

	warn(
		msg: string,
		obj: MergingObject<{
			event: string
		}>,
	): void {
		this.logger.warn(obj ?? {}, msg)
	}

	info(msg: string, obj?: MergingObject): void {
		this.logger.info(obj ?? {}, msg)
	}

	debug(msg: string, obj?: MergingObject): void {
		this.logger.debug(obj ?? {}, msg)
	}

	trace(msg: string, obj?: MergingObject): void {
		this.logger.trace(obj ?? {}, msg)
	}

	silent(msg: string, obj?: MergingObject): void {
		this.logger.silent(obj ?? {}, msg)
	}

	// replace the underlying pino logger
	set(pino: pino.Logger): ILogger {
		this.logger = pino
		return this
	}
}

export { pino } // Export pino for consumers who want to customize their own loggers
export const logger = PinoAdapter.logger
export default logger

/**
 * Initialize logger with given environment
 *
 * @param env Environment
 * @returns [pinoLogger, Logger]
 */
export const init = PinoAdapter.init

export const defaultLoggerOptions = loggerOptions[process.env.ENVIRONMENT as Environment] ?? loggerOptions.local
export * from "./interface"
