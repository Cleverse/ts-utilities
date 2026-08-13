import { z } from 'zod';

/**
 * Primitive type with not null or undefined
 */
type PrimitiveValue = string | number | boolean;
/**
 * Zod schema for PrimitiveValue
 *
 * NOTE:
 * We don't use `z.infer` to reduce bundle size and type inference performance.
 */
declare const PrimitiveValueSchema: z.ZodType<PrimitiveValue>;
/**
 * Primitive type
 */
type Primitive = PrimitiveValue | null | undefined;
/**
 * Zod schema for Primitive
 *
 * NOTE:
 * We don't use `z.infer` to reduce bundle size and type inference performance.
 */
declare const PrimitiveSchema: z.ZodType<Primitive>;

export { type Primitive, PrimitiveSchema, type PrimitiveValue, PrimitiveValueSchema };
