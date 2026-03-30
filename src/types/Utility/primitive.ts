import { z } from "zod"

/**
 * Primitive type with not null or undefined
 */
export type PrimitiveValue = string | number | boolean

/**
 * Zod schema for PrimitiveValue
 *
 * NOTE:
 * We don't use `z.infer` to reduce bundle size and type inference performance.
 */
export const PrimitiveValueSchema: z.ZodType<PrimitiveValue> = z.union([z.string(), z.number(), z.boolean()])

/**
 * Primitive type
 */
export type Primitive = PrimitiveValue | null | undefined

/**
 * Zod schema for Primitive
 *
 * NOTE:
 * We don't use `z.infer` to reduce bundle size and type inference performance.
 */
export const PrimitiveSchema: z.ZodType<Primitive> = z.union([PrimitiveValueSchema, z.null(), z.undefined()])
