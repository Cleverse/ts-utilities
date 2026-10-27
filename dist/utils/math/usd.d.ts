import { BigNumber } from 'bignumber.js';

declare const getUsdValue: (rawAmount: string, decimals: number, price: number) => BigNumber;

export { getUsdValue };
