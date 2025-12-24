/**
 * Extracts public properties of given class except methods.
 * ```ts
 * import { ClassProperties } from 'types'
 *
 * class Foo {
 * 	public a = 1
 * 	private b = 2
 * 	public c() { return 3 }
 * }
 *
 * type FooProps = ClassProperties<Foo> // { a: number }
 *
 * ```
 */
export type ClassProperties<C> = {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	[K in keyof C as C[K] extends Function ? never : K]: C[K]
}
