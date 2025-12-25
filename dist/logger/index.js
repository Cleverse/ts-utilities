import pino from "pino";
import { gcpPinoLoggerOptions } from "./gcp-options";
const loggerOptions = {
  local: {
    level: process.env.LOG_LEVEL || "trace",
    messageKey: "message",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname"
      }
    }
  },
  development: {
    level: process.env.LOG_LEVEL || "debug",
    ...gcpPinoLoggerOptions
  },
  production: {
    level: process.env.LOG_LEVEL || "info",
    ...gcpPinoLoggerOptions
  }
};
class PinoAdapter {
  constructor(logger2) {
    this.logger = logger2;
  }
  // Global default logger
  static _logger = new PinoAdapter(
    pino(loggerOptions[process.env.ENVIRONMENT] ?? loggerOptions.local)
  );
  static get logger() {
    return PinoAdapter._logger;
  }
  // Initialize logger with given environment
  static init(env) {
    const pinoLogger = pino(loggerOptions[env]);
    PinoAdapter._logger.set(pinoLogger);
    return [pinoLogger, PinoAdapter._logger];
  }
  // Create a new logger
  static new(pino2) {
    return new PinoAdapter(pino2);
  }
  with(bindings) {
    return new PinoAdapter(this.logger.child(bindings));
  }
  child(bindings) {
    return new PinoAdapter(this.logger.child(bindings));
  }
  fatal(msg, obj) {
    this.logger.fatal(obj ?? {}, msg);
  }
  error(msg, obj) {
    this.logger.error(obj ?? {}, msg);
  }
  warn(msg, obj) {
    this.logger.warn(obj ?? {}, msg);
  }
  info(msg, obj) {
    this.logger.info(obj ?? {}, msg);
  }
  debug(msg, obj) {
    this.logger.debug(obj ?? {}, msg);
  }
  trace(msg, obj) {
    this.logger.trace(obj ?? {}, msg);
  }
  silent(msg, obj) {
    this.logger.silent(obj ?? {}, msg);
  }
  // replace the underlying pino logger
  set(pino2) {
    this.logger = pino2;
    return this;
  }
}
const logger = PinoAdapter.logger;
var logger_default = logger;
const init = PinoAdapter.init;
const defaultLoggerOptions = loggerOptions[process.env.ENVIRONMENT] ?? loggerOptions.local;
export * from "./interface";
export {
  PinoAdapter,
  logger_default as default,
  defaultLoggerOptions,
  init,
  logger,
  pino
};
//# sourceMappingURL=index.js.map