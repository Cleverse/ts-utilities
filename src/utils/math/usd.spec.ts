import { BigNumber } from "bignumber.js"
import { describe, expect, it } from "vitest"

import { getUsdValue } from "./usd"

describe("math/usd", () => {
	it("should calculate USD value correctly", () => {
		const rawAmount = "1000000000000000000" // 1 unit
		const decimals = 18
		const price = 2000.5

		const result = getUsdValue(rawAmount, decimals, price)

		expect(result).toBeInstanceOf(BigNumber)
		expect(result.toString()).toBe("2000.5")
	})

	it("should handle different decimals", () => {
		const rawAmount = "1000000" // 1 unit (6 decimals)
		const decimals = 6
		const price = 100

		const result = getUsdValue(rawAmount, decimals, price)

		expect(result.toString()).toBe("100")
	})

	it("should handle fractional amounts", () => {
		const rawAmount = "500000000000000000" // 0.5 unit
		const decimals = 18
		const price = 100

		const result = getUsdValue(rawAmount, decimals, price)

		expect(result.toString()).toBe("50")
	})
})
