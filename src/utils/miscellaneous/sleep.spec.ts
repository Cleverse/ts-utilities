import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"

import { sleep, delay } from "./sleep"

describe("miscellaneous/sleep", () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("should wait for specified time", async () => {
		const ms = 1000
		const promise = sleep(ms)

		// Should not be resolved yet
		const resolved = vi.fn()
		promise.then(resolved)

		expect(resolved).not.toHaveBeenCalled()

		// Advance time
		await vi.advanceTimersByTimeAsync(ms)

		expect(resolved).toHaveBeenCalled()
	})

	it("should resolve immediately if signal is already aborted", async () => {
		const controller = new AbortController()
		controller.abort()

		const promise = sleep(1000, controller.signal)
		await expect(promise).resolves.toBeUndefined()
	})

	it("should abort sleeping when signal is aborted", async () => {
		const controller = new AbortController()
		const ms = 5000

		const promise = sleep(ms, controller.signal)

		// Advance slightly less than needed
		await vi.advanceTimersByTimeAsync(100)

		// Abort
		controller.abort()

		// Should resolve immediately after abort
		await expect(promise).resolves.toBeUndefined()
	})

	it("should have delay alias", () => {
		expect(delay).toBe(sleep)
	})
})
