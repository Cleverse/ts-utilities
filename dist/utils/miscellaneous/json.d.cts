import { JSONObject } from '../../types/Utility/json.cjs';
import '../../types/Utility/primitive.cjs';

/**
 * Convert JS Object to Object that safe for JSON.stringify
 */
declare function toJSONObject(obj: unknown): JSONObject;

export { toJSONObject };
