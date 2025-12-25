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
export {
  gcpPinoLoggerOptions
};
//# sourceMappingURL=gcp-options.js.map