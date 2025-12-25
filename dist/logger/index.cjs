"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var logger_exports = {};
__export(logger_exports, {
  PinoAdapter: () => PinoAdapter,
  default: () => logger_default,
  defaultLoggerOptions: () => defaultLoggerOptions,
  init: () => init,
  logger: () => logger,
  pino: () => import_pino.default
});
module.exports = __toCommonJS(logger_exports);
var import_pino = __toESM(require("pino"), 1);
var import_gcp_options = require("./gcp-options");
__reExport(logger_exports, require("./interface"), module.exports);
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
    ...import_gcp_options.gcpPinoLoggerOptions
  },
  production: {
    level: process.env.LOG_LEVEL || "info",
    ...import_gcp_options.gcpPinoLoggerOptions
  }
};
class PinoAdapter {
  constructor(logger2) {
    this.logger = logger2;
  }
  // Global default logger
  static _logger = new PinoAdapter(
    (0, import_pino.default)(loggerOptions[process.env.ENVIRONMENT] ?? loggerOptions.local)
  );
  static get logger() {
    return PinoAdapter._logger;
  }
  // Initialize logger with given environment
  static init(env) {
    const pinoLogger = (0, import_pino.default)(loggerOptions[env]);
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
//# sourceMappingURL=index.cjs.map