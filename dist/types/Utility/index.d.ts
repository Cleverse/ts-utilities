export { Combine, Merge, With } from './Intersec.js';
export { JSONArray, JSONArraySchema, JSONObject, JSONObjectSchema, JSONValue, JSONValueSchema } from './json.js';
export { Primitive, PrimitiveSchema, PrimitiveValue, PrimitiveValueSchema } from './primitive.js';
import 'zod';

/**
 * Make a field optional.
 *
 * @example
 * ```
 * type Student = {
 *   name: string
 *   school: string
 * }
 * type User = OptionalField<Student, "school">
 * ```
 */
type OptionalField<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
/**
 * Make a field required.
 *
 * @example
 * ```
 * type User = {
 *   name: string
 *   age?: number
 * }
 * type UserRequired = RequiredField<User, "age">
 * ```
 */
type RequiredField<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type { OptionalField, RequiredField };
