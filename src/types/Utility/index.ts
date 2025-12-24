export * from "./Intersec"
export * from "./json"

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
export type OptionalField<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

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
export type RequiredField<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
