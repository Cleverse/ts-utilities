import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"

import { Aborts } from "./index"

describe("aborts", () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe("awaitAbort", () => {
		it("should resolve when signal is aborted", async () => {
			const controller = new AbortController()

			// Trigger abort in future
			setTimeout(() => controller.abort(), 100)

			const promise = Aborts.awaitAbort(controller.signal)

			// Should not resolve yet
			const resolved = vi.fn()
			promise.then(resolved)
			expect(resolved).not.toHaveBeenCalled()

			// Advance time
			await vi.advanceTimersByTimeAsync(100)

			expect(resolved).toHaveBeenCalled()
		})

		it("should resolve immediately if already aborted", async () => {
			const controller = new AbortController()
			controller.abort()

			const promise = Aborts.awaitAbort(controller.signal)
			await expect(promise).resolves.toBeUndefined()
		})
	})

	describe("awaitAbortWithReject", () => {
		it("should reject when signal is aborted", async () => {
			const controller = new AbortController()
			setTimeout(() => controller.abort(new Error("aborted")), 100)

			const promise = Aborts.awaitAbortWithReject(controller.signal)

			// Catch the rejection to prevent "Unhandled Rejection"
			const catchFn = vi.fn()
			promise.catch(catchFn)

			// Advance time
			await vi.advanceTimersByTimeAsync(100)

			await expect(promise).rejects.toThrow("aborted")
		})

		it("should reject immediately if already aborted", async () => {
			const controller = new AbortController()
			controller.abort(new Error("aborted"))

			await expect(Aborts.awaitAbortWithReject(controller.signal)).rejects.toThrow("aborted")
		})
	})

	describe("awaitAbortOrTimeout", () => {
		it("should return timeout if time passes first", async () => {
			const controller = new AbortController()
			const promise = Aborts.awaitAbortOrTimeout(controller.signal, 100)

			await vi.advanceTimersByTimeAsync(100)

			await expect(promise).resolves.toBe("timeout")
		})

		it("should return aborted if signal aborts first", async () => {
			const controller = new AbortController()
			setTimeout(() => controller.abort(), 50)

			const promise = Aborts.awaitAbortOrTimeout(controller.signal, 100)

			await vi.advanceTimersByTimeAsync(50)

			await expect(promise).resolves.toBe("aborted")
		})
	})

	describe("raceWithAbort", () => {
		it("should return fulfilled status with value", async () => {
			const controller = new AbortController()
			const result = await Aborts.raceWithAbort(controller.signal, async () => "success")

			expect(result).toEqual({ status: "fulfilled", value: "success" })
		})

		it("should return aborted status with reason", async () => {
			const controller = new AbortController()

			// Abort after 10ms
			setTimeout(() => controller.abort(), 10)

			const promise = Aborts.raceWithAbort(controller.signal, async () => {
				// Task that takes longer than abort
				await new Promise((resolve) => setTimeout(resolve, 50))
				return "should not reach here"
			})

			// Advance past abort time but before task completion
			await vi.advanceTimersByTimeAsync(10)

			const result = await promise
			expect(result.status).toBe("aborted")
			expect(result.reason).toBeInstanceOf(DOMException)
			expect((result.reason as DOMException).name).toBe("AbortError")
		})

		it("should throw non-abort errors", async () => {
			const controller = new AbortController()

			await expect(
				Aborts.raceWithAbort(controller.signal, async () => {
					throw new Error("fail")
				}),
			).rejects.toThrow("fail")
		})
	})

	describe("withAbortSignal", () => {
		it("should reject with abort reason if aborted during execution", async () => {
			const controller = new AbortController()

			setTimeout(() => controller.abort(new Error("cancelled")), 10)

			const promise = Aborts.withAbortSignal(controller.signal, async () => {
				await new Promise((resolve) => setTimeout(resolve, 50))
			})

			// Catch the rejection to prevent "Unhandled Rejection"
			const catchFn = vi.fn()
			promise.catch(catchFn)

			await vi.advanceTimersByTimeAsync(10)

			await expect(promise).rejects.toThrow("cancelled")
		})
	})

	describe("raceAllWithAbort", () => {
		it("should resolve with first completed promise", async () => {
			const controller = new AbortController()

			const promise = Aborts.raceAllWithAbort(controller.signal, [
				async () => {
					await new Promise((r) => setTimeout(r, 50))
					return 1
				},
				async () => {
					await new Promise((r) => setTimeout(r, 10))
					return 2
				},
			])

			await vi.advanceTimersByTimeAsync(10)

			await expect(promise).resolves.toBe(2)
		})
	})
})
