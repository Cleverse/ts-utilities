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
var sleep_exports = {};
__export(sleep_exports, {
  delay: () => delay,
  sleep: () => sleep
});
module.exports = __toCommonJS(sleep_exports);
var import_node_events = require("node:events");
const sleep = (ms, signal) => {
  if (signal?.aborted) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    if (signal) {
      const disposable = (0, import_node_events.addAbortListener)(signal, () => {
        clearTimeout(timer);
        disposable[Symbol.dispose]();
        resolve();
      });
    }
  });
};
const delay = sleep;
//# sourceMappingURL=sleep.cjs.map