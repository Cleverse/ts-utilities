"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _chunkLGLNXDDWcjs = require('../chunk-LGLNXDDW.cjs');







var _chunkXDMBOPPTcjs = require('../chunk-XDMBOPPT.cjs');


var _chunk5JHPDOVLcjs = require('../chunk-5JHPDOVL.cjs');

// src/logger/index.spec.ts
_chunk5JHPDOVLcjs.init_cjs_shims.call(void 0, );
var { mockPino } = _chunkXDMBOPPTcjs.vi.hoisted(() => {
  const mockInstance = {
    child: _chunkXDMBOPPTcjs.vi.fn(),
    fatal: _chunkXDMBOPPTcjs.vi.fn(),
    error: _chunkXDMBOPPTcjs.vi.fn(),
    warn: _chunkXDMBOPPTcjs.vi.fn(),
    info: _chunkXDMBOPPTcjs.vi.fn(),
    debug: _chunkXDMBOPPTcjs.vi.fn(),
    trace: _chunkXDMBOPPTcjs.vi.fn(),
    silent: _chunkXDMBOPPTcjs.vi.fn(),
    set: _chunkXDMBOPPTcjs.vi.fn()
  };
  mockInstance.child.mockReturnValue(mockInstance);
  return {
    mockPinoInstance: mockInstance,
    mockPino: _chunkXDMBOPPTcjs.vi.fn(() => mockInstance)
  };
});
_chunkXDMBOPPTcjs.vi.mock("pino", () => {
  return {
    default: mockPino
  };
});
_chunkXDMBOPPTcjs.describe.call(void 0, "PinoAdapter", () => {
  const originalEnv = process.env;
  _chunkXDMBOPPTcjs.beforeEach.call(void 0, () => {
    _chunkXDMBOPPTcjs.vi.resetModules();
    _chunkXDMBOPPTcjs.vi.clearAllMocks();
    process.env = { ...originalEnv };
  });
  _chunkXDMBOPPTcjs.afterEach.call(void 0, () => {
    process.env = originalEnv;
  });
  _chunkXDMBOPPTcjs.describe.call(void 0, "init", () => {
    _chunkXDMBOPPTcjs.it.call(void 0, "should configure logger for local environment", async () => {
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("local");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, mockPino).toHaveBeenCalledWith(
        _chunkXDMBOPPTcjs.globalExpect.objectContaining({
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
    _chunkXDMBOPPTcjs.it.call(void 0, "should configure logger for development environment", async () => {
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("development");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, mockPino).toHaveBeenLastCalledWith(
        _chunkXDMBOPPTcjs.globalExpect.objectContaining({
          level: "debug",
          messageKey: _chunkLGLNXDDWcjs.gcpPinoLoggerOptions.messageKey
        })
      );
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should configure logger for production environment", async () => {
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("production");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, mockPino).toHaveBeenLastCalledWith(
        _chunkXDMBOPPTcjs.globalExpect.objectContaining({
          level: "info",
          messageKey: _chunkLGLNXDDWcjs.gcpPinoLoggerOptions.messageKey
        })
      );
    });
    _chunkXDMBOPPTcjs.it.call(void 0, "should respect LOG_LEVEL environment variable", async () => {
      process.env.LOG_LEVEL = "error";
      const { PinoAdapter } = await Promise.resolve().then(() => _interopRequireWildcard(require("./index.cjs")));
      PinoAdapter.init("local");
      _chunkXDMBOPPTcjs.globalExpect.call(void 0, mockPino).toHaveBeenCalledWith(
        _chunkXDMBOPPTcjs.globalExpect.objectContaining({
          level: "error"
        })
      );
    });
  });
});
//# sourceMappingURL=index.spec.cjs.map