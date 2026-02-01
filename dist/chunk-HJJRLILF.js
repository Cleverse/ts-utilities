// src/utils/time/ms.ts
import prettyMs from "pretty-ms";
var DEFAULT_MS_OPTIONS = {
  secondsDecimalDigits: 3,
  millisecondsDecimalDigits: 3
};
var ms = (ms2, options) => {
  return prettyMs(ms2, {
    ...DEFAULT_MS_OPTIONS,
    ...options
  });
};
var ms_default = ms;

export {
  ms,
  ms_default
};
//# sourceMappingURL=chunk-HJJRLILF.js.map