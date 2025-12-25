"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_vitest = require("vitest");
var import_gcp_options = require("./gcp-options");
const { mockPino } = import_vitest.vi.hoisted(() => {
  const mockInstance = {
    child: import_vitest.vi.fn(),
    fatal: import_vitest.vi.fn(),
    error: import_vitest.vi.fn(),
    warn: import_vitest.vi.fn(),
    info: import_vitest.vi.fn(),
    debug: import_vitest.vi.fn(),
    trace: import_vitest.vi.fn(),
    silent: import_vitest.vi.fn(),
    set: import_vitest.vi.fn()
  };
  mockInstance.child.mockReturnValue(mockInstance);
  return {
    mockPinoInstance: mockInstance,
    mockPino: import_vitest.vi.fn(() => mockInstance)
  };
});
import_vitest.vi.mock("pino", () => {
  return {
    default: mockPino
  };
});
(0, import_vitest.describe)("PinoAdapter", () => {
  const originalEnv = process.env;
  (0, import_vitest.beforeEach)(() => {
    import_vitest.vi.resetModules();
    import_vitest.vi.clearAllMocks();
    process.env = { ...originalEnv };
  });
  (0, import_vitest.afterEach)(() => {
    process.env = originalEnv;
  });
  (0, import_vitest.describe)("init", () => {
    (0, import_vitest.it)("should configure logger for local environment", async () => {
      const { PinoAdapter } = await import("./index");
      PinoAdapter.init("local");
      (0, import_vitest.expect)(mockPino).toHaveBeenCalledWith(
        import_vitest.expect.objectContaining({
          level: "trace",
          transport: {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname"
            }
          }
        })
      );
    });
    (0, import_vitest.it)("should configure logger for development environment", async () => {
      const { PinoAdapter } = await import("./index");
      PinoAdapter.init("development");
      (0, import_vitest.expect)(mockPino).toHaveBeenLastCalledWith(
        import_vitest.expect.objectContaining({
          level: "debug",
          messageKey: import_gcp_options.gcpPinoLoggerOptions.messageKey
        })
      );
    });
    (0, import_vitest.it)("should configure logger for production environment", async () => {
      const { PinoAdapter } = await import("./index");
      PinoAdapter.init("production");
      (0, import_vitest.expect)(mockPino).toHaveBeenLastCalledWith(
        import_vitest.expect.objectContaining({
          level: "info",
          messageKey: import_gcp_options.gcpPinoLoggerOptions.messageKey
        })
      );
    });
    (0, import_vitest.it)("should respect LOG_LEVEL environment variable", async () => {
      process.env.LOG_LEVEL = "error";
      const { PinoAdapter } = await import("./index");
      PinoAdapter.init("local");
      (0, import_vitest.expect)(mockPino).toHaveBeenCalledWith(
        import_vitest.expect.objectContaining({
          level: "error"
        })
      );
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map