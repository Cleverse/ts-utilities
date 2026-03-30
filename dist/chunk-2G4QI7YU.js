// src/types/Utility/primitive.ts
import { z } from "zod";
var PrimitiveValueSchema = z.union([z.string(), z.number(), z.boolean()]);
var PrimitiveSchema = z.union([PrimitiveValueSchema, z.null(), z.undefined()]);

export {
  PrimitiveValueSchema,
  PrimitiveSchema
};
//# sourceMappingURL=chunk-2G4QI7YU.js.map