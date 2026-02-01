// src/utils/miscellaneous/json.ts
import * as superjson from "superjson";
function toJSONObject(obj) {
  if (obj === null || obj === void 0) {
    return {};
  }
  const { json } = superjson.serialize(obj);
  return json;
}

export {
  toJSONObject
};
//# sourceMappingURL=chunk-YNGFAVSP.js.map