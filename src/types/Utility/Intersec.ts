/**
 * Readable util type for intersection of two types.
 */
export type Combine<T, U> = T & U

/**
 * Readable util type for intersection two types.
 */
export type Merge<T, U> = Combine<T, U>

/**
 * Readable util type for intersection two types.
 */
export type With<T, U> = Combine<T, U>
