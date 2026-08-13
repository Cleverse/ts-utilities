"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }






var _chunkDS2XYV5Gcjs = require('../chunk-DS2XYV5G.cjs');


var _chunkIPW2R7ZDcjs = require('../chunk-IPW2R7ZD.cjs');


var _chunkT6TWWATEcjs = require('../chunk-T6TWWATE.cjs');

// src/logger/index.spec.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var { mockPino } = _chunkDS2XYV5Gcjs.vi.hoisted(() => {
  const mockInstance = {
    child: _chunkDS2XYV5Gcjs.vi.fn(),
    fatal: _chunkDS2XYV5Gcjs.vi.fn(),
    error: _chunkDS2XYV5Gcjs.vi.fn(),
    warn: _chunkDS2XYV5Gcjs.vi.fn(),
    info: _chunkDS2XYV5Gcjs.vi.fn(),
    debug: _chunkDS2XYV5Gcjs.vi.fn(),
    trace: _chunkDS2XYV5Gcjs.vi.fn(),
    silent: _chunkDS2XYV5Gcjs.vi.fn(),
    set: _chunkDS2XYV5Gcjs.vi.fn()
  };
  mockInstance.child.mockReturnValue(mockInstance);
  return {
    mockPinoInstance: mockInstance,
    mockPino: _chunkDS2XYV5Gcjs.vi.fn(() => mockInstance)
  };
});
_chunkDS2XYV5Gcjs.vi.mock("pino", () => {
  return {
    default: mockPino
  };
});
_chunkDS2XYV5Gcjs.describe.call(void 0, "PinoAdapter", () => {
  const originalEnv = process.env;
  _chunkDS2XYV5Gcjs.beforeEach.call(void 0, () => {
    _chunkDS2XYV5Gcjs.vi.resetModules();
    _chunkDS2XYV5Gcjs.vi.clearAllMocks();
    process.env = { ...originalEnv };
  });
  _chunkDS2XYV5Gcjs.afterEach.call(void 0, () => {
    process.env = originalEnv;
  });
  _chunkDS2XYV5Gcjs.describe.call(void 0, "init", () => {
    _chunkDS2XYV5Gcjs.it.call(void 0, "should configure logger for local environment", async () => {
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("local");
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockPino).toHaveBeenCalledWith(
        _chunkDS2XYV5Gcjs.globalExpect.objectContaining({
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
    _chunkDS2XYV5Gcjs.it.call(void 0, "should configure logger for development environment", async () => {
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("development");
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockPino).toHaveBeenLastCalledWith(
        _chunkDS2XYV5Gcjs.globalExpect.objectContaining({
          level: "debug",
          messageKey: _chunkIPW2R7ZDcjs.gcpPinoLoggerOptions.messageKey
        })
      );
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should configure logger for production environment", async () => {
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("production");
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockPino).toHaveBeenLastCalledWith(
        _chunkDS2XYV5Gcjs.globalExpect.objectContaining({
          level: "info",
          messageKey: _chunkIPW2R7ZDcjs.gcpPinoLoggerOptions.messageKey
        })
      );
    });
    _chunkDS2XYV5Gcjs.it.call(void 0, "should respect LOG_LEVEL environment variable", async () => {
      process.env.LOG_LEVEL = "error";
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("local");
      _chunkDS2XYV5Gcjs.globalExpect.call(void 0, mockPino).toHaveBeenCalledWith(
        _chunkDS2XYV5Gcjs.globalExpect.objectContaining({
          level: "error"
        })
      );
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map