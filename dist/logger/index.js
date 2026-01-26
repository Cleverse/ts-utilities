import {
  gcpPinoLoggerOptions
} from "../chunk-HRZXEBFF.js";
import "../chunk-G3PMV62Z.js";
import "../chunk-GZ5JOSMS.js";

// src/logger/index.ts
import pino from "pino";
var loggerOptions = {
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
var PinoAdapter = class _PinoAdapter {
  constructor(logger2) {
    this.logger = logger2;
  }
  // Global default logger
  static _logger = new _PinoAdapter(
    pino(loggerOptions[process.env.ENVIRONMENT] ?? loggerOptions.local)
  );
  static get logger() {
    return _PinoAdapter._logger;
  }
  // Initialize logger with given environment
  static init(env) {
    const pinoLogger = pino(loggerOptions[env]);
    _PinoAdapter._logger.set(pinoLogger);
    return [pinoLogger, _PinoAdapter._logger];
  }
  // Create a new logger
  static new(pino2) {
    return new _PinoAdapter(pino2);
  }
  with(bindings) {
    return new _PinoAdapter(this.logger.child(bindings));
  }
  child(bindings) {
    return new _PinoAdapter(this.logger.child(bindings));
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
};
var logger = PinoAdapter.logger;
var logger_default = logger;
var init = PinoAdapter.init;
var defaultLoggerOptions = loggerOptions[process.env.ENVIRONMENT] ?? loggerOptions.local;
export {
  PinoAdapter,
  logger_default as default,
  defaultLoggerOptions,
  init,
  logger,
  pino
};
//# sourceMappingURL=index.js.map