"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _chunkLAQNDS5Gcjs = require('../chunk-LAQNDS5G.cjs');







var _chunkBFR6AXPAcjs = require('../chunk-BFR6AXPA.cjs');


var _chunk2X3FSA3Bcjs = require('../chunk-2X3FSA3B.cjs');

// src/logger/index.spec.ts
_chunk2X3FSA3Bcjs.init_cjs_shims.call(void 0, );
var { mockPino } = _chunkBFR6AXPAcjs.vi.hoisted(() => {
  const mockInstance = {
    child: _chunkBFR6AXPAcjs.vi.fn(),
    fatal: _chunkBFR6AXPAcjs.vi.fn(),
    error: _chunkBFR6AXPAcjs.vi.fn(),
    warn: _chunkBFR6AXPAcjs.vi.fn(),
    info: _chunkBFR6AXPAcjs.vi.fn(),
    debug: _chunkBFR6AXPAcjs.vi.fn(),
    trace: _chunkBFR6AXPAcjs.vi.fn(),
    silent: _chunkBFR6AXPAcjs.vi.fn(),
    set: _chunkBFR6AXPAcjs.vi.fn()
  };
  mockInstance.child.mockReturnValue(mockInstance);
  return {
    mockPinoInstance: mockInstance,
    mockPino: _chunkBFR6AXPAcjs.vi.fn(() => mockInstance)
  };
});
_chunkBFR6AXPAcjs.vi.mock("pino", () => {
  return {
    default: mockPino
  };
});
_chunkBFR6AXPAcjs.describe.call(void 0, "PinoAdapter", () => {
  const originalEnv = process.env;
  _chunkBFR6AXPAcjs.beforeEach.call(void 0, () => {
    _chunkBFR6AXPAcjs.vi.resetModules();
    _chunkBFR6AXPAcjs.vi.clearAllMocks();
    process.env = { ...originalEnv };
  });
  _chunkBFR6AXPAcjs.afterEach.call(void 0, () => {
    process.env = originalEnv;
  });
  _chunkBFR6AXPAcjs.describe.call(void 0, "init", () => {
    _chunkBFR6AXPAcjs.it.call(void 0, "should configure logger for local environment", async () => {
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("local");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockPino).toHaveBeenCalledWith(
        _chunkBFR6AXPAcjs.globalExpect.objectContaining({
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
    _chunkBFR6AXPAcjs.it.call(void 0, "should configure logger for development environment", async () => {
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("development");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockPino).toHaveBeenLastCalledWith(
        _chunkBFR6AXPAcjs.globalExpect.objectContaining({
          level: "debug",
          messageKey: _chunkLAQNDS5Gcjs.gcpPinoLoggerOptions.messageKey
        })
      );
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should configure logger for production environment", async () => {
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("production");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockPino).toHaveBeenLastCalledWith(
        _chunkBFR6AXPAcjs.globalExpect.objectContaining({
          level: "info",
          messageKey: _chunkLAQNDS5Gcjs.gcpPinoLoggerOptions.messageKey
        })
      );
    });
    _chunkBFR6AXPAcjs.it.call(void 0, "should respect LOG_LEVEL environment variable", async () => {
      process.env.LOG_LEVEL = "error";
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("local");
      _chunkBFR6AXPAcjs.globalExpect.call(void 0, mockPino).toHaveBeenCalledWith(
        _chunkBFR6AXPAcjs.globalExpect.objectContaining({
          level: "error"
        })
      );
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map