import { PrimitiveValue } from "@/types/Utility/primitive"

/**
A JSON value can be a string, number, boolean, object, array, or null.
JSON values can be serialized and deserialized by the JSON.stringify and JSON.parse methods.
 */
export type JSONValue = null | PrimitiveValue | JSONObject | JSONArray
export type JSONObject = {
	[key: string]: JSONValue
}
export type JSONArray = JSONValue[]
