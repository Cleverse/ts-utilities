"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }






var _chunk5BHWYHGYcjs = require('../chunk-5BHWYHGY.cjs');


var _chunkIPW2R7ZDcjs = require('../chunk-IPW2R7ZD.cjs');


var _chunkT6TWWATEcjs = require('../chunk-T6TWWATE.cjs');

// src/logger/index.spec.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var { mockPino } = _chunk5BHWYHGYcjs.vi.hoisted(() => {
  const mockInstance = {
    child: _chunk5BHWYHGYcjs.vi.fn(),
    fatal: _chunk5BHWYHGYcjs.vi.fn(),
    error: _chunk5BHWYHGYcjs.vi.fn(),
    warn: _chunk5BHWYHGYcjs.vi.fn(),
    info: _chunk5BHWYHGYcjs.vi.fn(),
    debug: _chunk5BHWYHGYcjs.vi.fn(),
    trace: _chunk5BHWYHGYcjs.vi.fn(),
    silent: _chunk5BHWYHGYcjs.vi.fn(),
    set: _chunk5BHWYHGYcjs.vi.fn()
  };
  mockInstance.child.mockReturnValue(mockInstance);
  return {
    mockPinoInstance: mockInstance,
    mockPino: _chunk5BHWYHGYcjs.vi.fn(() => mockInstance)
  };
});
_chunk5BHWYHGYcjs.vi.mock("pino", () => {
  return {
    default: mockPino
  };
});
_chunk5BHWYHGYcjs.describe.call(void 0, "PinoAdapter", () => {
  const originalEnv = process.env;
  _chunk5BHWYHGYcjs.beforeEach.call(void 0, () => {
    _chunk5BHWYHGYcjs.vi.resetModules();
    _chunk5BHWYHGYcjs.vi.clearAllMocks();
    process.env = { ...originalEnv };
  });
  _chunk5BHWYHGYcjs.afterEach.call(void 0, () => {
    process.env = originalEnv;
  });
  _chunk5BHWYHGYcjs.describe.call(void 0, "init", () => {
    _chunk5BHWYHGYcjs.it.call(void 0, "should configure logger for local environment", async () => {
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("local");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockPino).toHaveBeenCalledWith(
        _chunk5BHWYHGYcjs.globalExpect.objectContaining({
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
    _chunk5BHWYHGYcjs.it.call(void 0, "should configure logger for development environment", async () => {
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("development");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockPino).toHaveBeenLastCalledWith(
        _chunk5BHWYHGYcjs.globalExpect.objectContaining({
          level: "debug",
          messageKey: _chunkIPW2R7ZDcjs.gcpPinoLoggerOptions.messageKey
        })
      );
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should configure logger for production environment", async () => {
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("production");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockPino).toHaveBeenLastCalledWith(
        _chunk5BHWYHGYcjs.globalExpect.objectContaining({
          level: "info",
          messageKey: _chunkIPW2R7ZDcjs.gcpPinoLoggerOptions.messageKey
        })
      );
    });
    _chunk5BHWYHGYcjs.it.call(void 0, "should respect LOG_LEVEL environment variable", async () => {
      process.env.LOG_LEVEL = "error";
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("local");
      _chunk5BHWYHGYcjs.globalExpect.call(void 0, mockPino).toHaveBeenCalledWith(
        _chunk5BHWYHGYcjs.globalExpect.objectContaining({
          level: "error"
        })
      );
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map