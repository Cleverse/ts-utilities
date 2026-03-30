import {
  PrimitiveValueSchema
} from "./chunk-2G4QI7YU.js";

// src/types/Utility/json.ts
import { z } from "zod";
var JSONValueSchema = z.lazy(
  () => z.union([z.null(), PrimitiveValueSchema, JSONObjectSchema, JSONArraySchema])
);
var JSONObjectSchema = z.lazy(() => z.record(z.string(), JSONValueSchema));
var JSONArraySchema = z.lazy(() => z.array(JSONValueSchema));

export {
  JSONValueSchema,
  JSONObjectSchema,
  JSONArraySchema
};
//# sourceMappingURL=chunk-F7JT54UB.js.map