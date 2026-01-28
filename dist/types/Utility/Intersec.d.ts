/**
 * Readable util type for intersection of two types.
 */
type Combine<T, U> = T & U;
/**
 * Readable util type for intersection two types.
 */
type Merge<T, U> = Combine<T, U>;
/**
 * Readable util type for intersection two types.
 */
type With<T, U> = Combine<T, U>;

export type { Combine, Merge, With };
