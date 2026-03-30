import { z } from 'zod';
import { PrimitiveValue } from './primitive.js';

/**
A JSON value can be a string, number, boolean, object, array, or null.
JSON values can be serialized and deserialized by the JSON.stringify and JSON.parse methods.
 */
type JSONValue = null | PrimitiveValue | JSONObject | JSONArray;
type JSONObject = {
    [key: string]: JSONValue;
};
type JSONArray = JSONValue[];
/**
 * Zod schema for JSON value
 *
 * NOTE:
 * We don't use `z.infer` to reduce bundle size and type inference performance.
 */
declare const JSONValueSchema: z.ZodType<JSONValue>;
declare const JSONObjectSchema: z.ZodType<JSONObject>;
declare const JSONArraySchema: z.ZodType<JSONArray>;

export { type JSONArray, JSONArraySchema, type JSONObject, JSONObjectSchema, type JSONValue, JSONValueSchema };
