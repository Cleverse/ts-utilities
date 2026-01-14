/**
 * Golang-like errors utilities.
 */
declare class errors {
    /**
     * Finding an error of a specific type within the cause chain.
     *
     * Support normal error cause (ES2021+) and VError/NError style causes
     */
    static find<T extends Error>(err: Error | unknown, reference: new (...args: any[]) => T): T | undefined;
    /**
     * Finding an wrapped error is a match of the reference error.
     * It's like `errors.Is` in Golang.
     *
     * Support normal error cause (ES2021+) and VError/NError style causes
     *
     * @example
     * ```ts
     * try {
     *   await someRecoverableTask().catch((err) => {
     *     throw new Error("failed to do something", { cause: err })
     *   })
     * } catch (err: unknown) {
     *   // `true`
     *   if (errors.is(err, Error)){
     *     console.error(err.message) // auto type inference to `Error`
     *   }
     *
     *   // `true` supports to check chain of errors cause
     *   if (errors.is(err, RecoverableError)){
     *     console.error(err.message) // auto type inference to `Error`
     *   }
     * }
     * ```
     */
    static is<T extends Error>(err: Error | unknown, reference: new (...args: any[]) => T): err is Error;
    /**
     * Checking and casting an error to a specific type.
     * It's like `errors.As` in Golang.
     *
     * @example
     * ```ts
     * try {
     *   await someRecoverableTask().catch((err) => {
     *     throw new HTTPError(401, "failed to do something")
     *   })
     * } catch (err: unknown) {
     *   // `true`
     *   if (errors.as(err, HTTPError)){
     *     console.error(err.code) // type inference to `HTTPError`
     *   }
     *
     *   // `true` because `HTTPError` is inherited from `Error`
     *   if (errors.as(err, Error)){
     *     console.error(err.message) // type inference to `Error`
     *   }
     * }
     * ```
     */
    static as<T extends Error>(err: Error | unknown, reference: new (...args: any[]) => T): err is T;
    /**
     * Unwrapping the error cause.
     *
     * Support normal error cause (ES2021+) and VError/NError style causes
     */
    static unwrap(err: Error | unknown): Error | undefined;
    /**
     * Joining multiple errors.
     */
    static join(errs: Error[]): Error | null;
    static toError(err: unknown): Error;
}

export { errors as default, errors };
