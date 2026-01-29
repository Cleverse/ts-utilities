import { JSONObject } from '../../types/Utility/json.js';
import '../../types/Utility/primitive.js';

/**
 * Convert JS Object to Object that safe for JSON.stringify
 */
declare function toJSONObject(obj: unknown): JSONObject;

export { toJSONObject };
