import { BigNumber } from "bignumber.js"

export const getUsdValue = (rawAmount: string, decimals: number, price: number): BigNumber => {
	return new BigNumber(rawAmount).times(price).shiftedBy(-decimals)
}
