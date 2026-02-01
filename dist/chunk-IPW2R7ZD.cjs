"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/logger/gcp-options.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var levelToSeverity = {
  trace: "DEBUG",
  debug: "DEBUG",
  info: "INFO",
  warn: "WARNING",
  error: "ERROR",
  fatal: "CRITICAL"
};
var gcpPinoLoggerOptions = {
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
      const stackTrace = _optionalChain([logObject, 'access', _ => _.err, 'optionalAccess', _2 => _2.stack]);
      const stackProp = stackTrace ? { stack_trace: stackTrace } : {};
      return { ...object, ...stackProp };
    }
  }
};



exports.gcpPinoLoggerOptions = gcpPinoLoggerOptions;
//# sourceMappingURL=chunk-IPW2R7ZD.cjs.map