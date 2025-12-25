import prettyMs from "pretty-ms";
const DEFAULT_MS_OPTIONS = {
  secondsDecimalDigits: 3,
  millisecondsDecimalDigits: 3
};
const ms = (ms2, options) => {
  return prettyMs(ms2, {
    ...DEFAULT_MS_OPTIONS,
    ...options
  });
};
var ms_default = ms;
export {
  ms_default as default,
  ms
};
//# sourceMappingURL=ms.js.map