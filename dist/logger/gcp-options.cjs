"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var gcp_options_exports = {};
__export(gcp_options_exports, {
  gcpPinoLoggerOptions: () => gcpPinoLoggerOptions
});
module.exports = __toCommonJS(gcp_options_exports);
const levelToSeverity = {
  trace: "DEBUG",
  debug: "DEBUG",
  info: "INFO",
  warn: "WARNING",
  error: "ERROR",
  fatal: "CRITICAL"
};
const gcpPinoLoggerOptions = {
  messageKey: "message",
  formatters: {
    level(label) {
      const pinoLevel = label;
      const severity = levelToSeverity[pinoLevel];
      const typeProp = pinoLevel === "error" || pinoLevel === "fatal" ? {
        "@type": "type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent"
      } : {};
      return { severity, ...typeProp };
    },
    log(object) {
      const logObject = object;
      const stackTrace = logObject.err?.stack;
      const stackProp = stackTrace ? { stack_trace: stackTrace } : {};
      return { ...object, ...stackProp };
    }
  }
};
//# sourceMappingURL=gcp-options.cjs.map