import * as superjson from "superjson"

import { JSONObject } from "@/types/Utility"

/**
 * Convert JS Object to Object that safe for JSON.stringify
 */
export function toJSONObject(obj: unknown): JSONObject {
	if (obj === null || obj === undefined) {
		return {}
	}
	const { json } = superjson.serialize(obj)
	return json as JSONObject
}
