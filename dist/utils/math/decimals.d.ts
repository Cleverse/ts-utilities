/**
 * Convert a bigint (wei) to a decimal value with highest precision
 *
 * @param {bigint} value wei value to convert
 * @param {number} [decimals=18] number of decimals. Default is 18
 * @returns {BigNumber} the value in decimal
 */
declare function toDecimal(value: bigint, decimals?: number): BigNumber;
/**
 * Convert a bigint (wei) to a number (the precision is not guaranteed)
 *
 * @param {bigint} value wei value to convert
 * @param {number} [decimals=18] number of decimals. Default is 18
 * @returns {number} the value in number
 */
declare function toNumber(value: bigint, decimals?: number): number;
/**
 * Convert a decimal value to a bigint (wei)
 *
 * @param {(number | BigNumber)} value decimal value to convert
 * @param {number} [decimals=18] number of decimals. Default is 18
 * @returns {bigint} the value in wei
 */
declare function fromDecimal(value: number | BigNumber, decimals?: number): bigint;
/**
 * Alias for `fromDecimal`
 *
 * @param {(number | BigNumber)} value decimal value to convert
 * @param {number} [decimals=18] number of decimals. Default is 18
 * @returns {bigint} the value in wei
 */
declare function toBigint(value: number | BigNumber, decimals?: number): bigint;
declare const decimals: {
    toDecimal: typeof toDecimal;
    toNumber: typeof toNumber;
    fromDecimal: typeof fromDecimal;
    toBigint: typeof toBigint;
};

export { decimals, fromDecimal, toBigint, toDecimal, toNumber };
