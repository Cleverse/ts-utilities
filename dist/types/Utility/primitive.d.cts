/**
 * Primitive type with not null or undefined
 */
type PrimitiveValue = string | number | boolean;
/**
 * Primitive type
 */
type Primitive = PrimitiveValue | null | undefined;

export type { Primitive, PrimitiveValue };
