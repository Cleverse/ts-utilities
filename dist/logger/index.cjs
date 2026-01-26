"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } var _class;

var _chunkIPW2R7ZDcjs = require('../chunk-IPW2R7ZD.cjs');
require('../chunk-XKCUFI4V.cjs');


var _chunkT6TWWATEcjs = require('../chunk-T6TWWATE.cjs');

// src/logger/index.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _pino = require('pino'); var _pino2 = _interopRequireDefault(_pino);
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
    ..._chunkIPW2R7ZDcjs.gcpPinoLoggerOptions
  },
  production: {
    level: process.env.LOG_LEVEL || "info",
    ..._chunkIPW2R7ZDcjs.gcpPinoLoggerOptions
  }
};
var PinoAdapter = (_class = class _PinoAdapter {
  constructor(logger2) {
    this.logger = logger2;
  }
  // Global default logger
  static __initStatic() {this._logger = new _PinoAdapter(
    _pino2.default.call(void 0, _nullishCoalesce(loggerOptions[process.env.ENVIRONMENT], () => ( loggerOptions.local)))
  )}
  static get logger() {
    return _PinoAdapter._logger;
  }
  // Initialize logger with given environment
  static init(env) {
    const pinoLogger = _pino2.default.call(void 0, loggerOptions[env]);
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
    this.logger.fatal(_nullishCoalesce(obj, () => ( {})), msg);
  }
  error(msg, obj) {
    this.logger.error(_nullishCoalesce(obj, () => ( {})), msg);
  }
  warn(msg, obj) {
    this.logger.warn(_nullishCoalesce(obj, () => ( {})), msg);
  }
  info(msg, obj) {
    this.logger.info(_nullishCoalesce(obj, () => ( {})), msg);
  }
  debug(msg, obj) {
    this.logger.debug(_nullishCoalesce(obj, () => ( {})), msg);
  }
  trace(msg, obj) {
    this.logger.trace(_nullishCoalesce(obj, () => ( {})), msg);
  }
  silent(msg, obj) {
    this.logger.silent(_nullishCoalesce(obj, () => ( {})), msg);
  }
  // replace the underlying pino logger
  set(pino2) {
    this.logger = pino2;
    return this;
  }
}, _class.__initStatic(), _class);
var logger = PinoAdapter.logger;
var logger_default = logger;
var init = PinoAdapter.init;
var defaultLoggerOptions = _nullishCoalesce(loggerOptions[process.env.ENVIRONMENT], () => ( loggerOptions.local));







exports.PinoAdapter = PinoAdapter; exports.default = logger_default; exports.defaultLoggerOptions = defaultLoggerOptions; exports.init = init; exports.logger = logger; exports.pino = _pino2.default;
//# sourceMappingURL=index.cjs.map