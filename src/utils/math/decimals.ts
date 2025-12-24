import { BigNumber } from "bignumber.js"

/**
 * Convert a bigint (wei) to a decimal value with highest precision
 *
 * @param {bigint} value wei value to convert
 * @param {number} [decimals=18] number of decimals. Default is 18
 * @returns {BigNumber} the value in decimal
 */
export function toDecimal(value: bigint, decimals: number = 18): BigNumber {
	return BigNumber(value.toString()).div(BigNumber(10).pow(decimals))
}

/**
 * Convert a bigint (wei) to a number (the precision is not guaranteed)
 *
 * @param {bigint} value wei value to convert
 * @param {number} [decimals=18] number of decimals. Default is 18
 * @returns {number} the value in number
 */
export function toNumber(value: bigint, decimals: number = 18): number {
	return toDecimal(value, decimals).toNumber()
}

/**
 * Convert a decimal value to a bigint (wei)
 *
 * @param {(number | BigNumber)} value decimal value to convert
 * @param {number} [decimals=18] number of decimals. Default is 18
 * @returns {bigint} the value in wei
 */
export function fromDecimal(value: number | BigNumber, decimals: number = 18): bigint {
	const bn = new BigNumber(value).multipliedBy(BigNumber(10).pow(decimals))
	return BigInt(bn.toFixed())
}

/**
 * Alias for `fromDecimal`
 *
 * @param {(number | BigNumber)} value decimal value to convert
 * @param {number} [decimals=18] number of decimals. Default is 18
 * @returns {bigint} the value in wei
 */
export function toBigint(value: number | BigNumber, decimals: number = 18): bigint {
	return fromDecimal(value, decimals)
}

// Namespaced export
export const decimals = {
	toDecimal,
	toNumber,
	fromDecimal,
	toBigint,
}
