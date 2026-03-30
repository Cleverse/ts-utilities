import { z } from "zod"

import { PrimitiveValue, PrimitiveValueSchema } from "@/types/Utility/primitive"

/**
A JSON value can be a string, number, boolean, object, array, or null.
JSON values can be serialized and deserialized by the JSON.stringify and JSON.parse methods.
 */
export type JSONValue = null | PrimitiveValue | JSONObject | JSONArray
export type JSONObject = {
	[key: string]: JSONValue
}
export type JSONArray = JSONValue[]

/**
 * Zod schema for JSON value
 *
 * NOTE:
 * We don't use `z.infer` to reduce bundle size and type inference performance.
 */
export const JSONValueSchema: z.ZodType<JSONValue> = z.lazy(() =>
	z.union([z.null(), PrimitiveValueSchema, JSONObjectSchema, JSONArraySchema]),
)
export const JSONObjectSchema: z.ZodType<JSONObject> = z.lazy(() => z.record(z.string(), JSONValueSchema))
export const JSONArraySchema: z.ZodType<JSONArray> = z.lazy(() => z.array(JSONValueSchema))
