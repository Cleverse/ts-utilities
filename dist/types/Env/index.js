import { z } from "zod";
const Environment = z.enum(["local", "development", "production"]).default("development");
export {
  Environment
};
//# sourceMappingURL=index.js.map