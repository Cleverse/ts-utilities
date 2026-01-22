import {
  gcpPinoLoggerOptions
} from "../chunk-HRZXEBFF.js";
import {
  afterEach,
  beforeEach,
  describe,
  globalExpect,
  it,
  vi
} from "../chunk-AZYASILH.js";
import "../chunk-G3PMV62Z.js";

// src/logger/index.spec.ts
var { mockPino } = vi.hoisted(() => {
  const mockInstance = {
    child: vi.fn(),
    fatal: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
    silent: vi.fn(),
    set: vi.fn()
  };
  mockInstance.child.mockReturnValue(mockInstance);
  return {
    mockPinoInstance: mockInstance,
    mockPino: vi.fn(() => mockInstance)
  };
});
vi.mock("pino", () => {
  return {
    default: mockPino
  };
});
describe("PinoAdapter", () => {
  const originalEnv = process.env;
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });
  afterEach(() => {
    process.env = originalEnv;
  });
  describe("init", () => {
    it("should configure logger for local environment", async () => {
      const { PinoAdapter } = await import("./index.js");
      PinoAdapter.init("local");
      globalExpect(mockPino).toHaveBeenCalledWith(
        globalExpect.objectContaining({
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
    it("should configure logger for development environment", async () => {
      const { PinoAdapter } = await import("./index.js");
      PinoAdapter.init("development");
      globalExpect(mockPino).toHaveBeenLastCalledWith(
        globalExpect.objectContaining({
          level: "debug",
          messageKey: gcpPinoLoggerOptions.messageKey
        })
      );
    });
    it("should configure logger for production environment", async () => {
      const { PinoAdapter } = await import("./index.js");
      PinoAdapter.init("production");
      globalExpect(mockPino).toHaveBeenLastCalledWith(
        globalExpect.objectContaining({
          level: "info",
          messageKey: gcpPinoLoggerOptions.messageKey
        })
      );
    });
    it("should respect LOG_LEVEL environment variable", async () => {
      process.env.LOG_LEVEL = "error";
      const { PinoAdapter } = await import("./index.js");
      PinoAdapter.init("local");
      globalExpect(mockPino).toHaveBeenCalledWith(
        globalExpect.objectContaining({
          level: "error"
        })
      );
    });
  });
});
//# sourceMappingURL=index.spec.js.map