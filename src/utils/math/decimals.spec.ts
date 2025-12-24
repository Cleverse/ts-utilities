import { BigNumber } from "bignumber.js"
import { describe, expect, it } from "vitest"

import { toDecimal, toNumber, fromDecimal, toBigint } from "./decimals"

describe("math/decimals", () => {
	describe("toDecimal", () => {
		it("should convert wei to decimal with default 18 decimals", () => {
			const wei = BigInt("1000000000000000000") // 1e18
			const result = toDecimal(wei)
			expect(result).toBeInstanceOf(BigNumber)
			expect(result.toString()).toBe("1")
		})

		it("should convert wei to decimal with custom decimals", () => {
			const wei = BigInt("1000000") // 1e6
			const result = toDecimal(wei, 6)
			expect(result.toString()).toBe("1")
		})

		it("should handle partial decimal values", () => {
			const wei = BigInt("1500000000000000000") // 1.5e18
			const result = toDecimal(wei)
			expect(result.toString()).toBe("1.5")
		})
	})

	describe("toNumber", () => {
		it("should convert wei to number", () => {
			const wei = BigInt("1500000000000000000") // 1.5e18
			const result = toNumber(wei)
			expect(typeof result).toBe("number")
			expect(result).toBe(1.5)
		})
	})

	describe("fromDecimal", () => {
		it("should convert number to wei", () => {
			const value = 1.5
			const result = fromDecimal(value)
			expect(typeof result).toBe("bigint")
			expect(result).toBe(BigInt("1500000000000000000"))
		})

		it("should convert BigNumber to wei", () => {
			const value = new BigNumber("1.5")
			const result = fromDecimal(value)
			expect(result).toBe(BigInt("1500000000000000000"))
		})

		it("should handle custom decimals", () => {
			const value = 1
			const result = fromDecimal(value, 6)
			expect(result).toBe(BigInt("1000000"))
		})
	})

	describe("toBigint", () => {
		it("should be an alias for fromDecimal", () => {
			const value = 1.5
			const result = toBigint(value)
			expect(result).toBe(BigInt("1500000000000000000"))
		})
	})
})
