// src/types/Env/index.ts
import { z } from "zod";
var Environment = z.enum(["local", "development", "production"]).default("development");

export {
  Environment
};
//# sourceMappingURL=chunk-4RH5DUGW.js.map