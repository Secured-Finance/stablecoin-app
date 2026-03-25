import { Decimal } from '@secured-finance/stablecoin-lib-base';

export const truncateDecimal = (value: Decimal, precision = 2): Decimal => {
    const factor = Decimal.from(10).pow(precision);
    const multiplied = value.mul(factor);
    const flooredString = multiplied.toString(0);
    const flooredDecimal = Decimal.from(flooredString);
    return flooredDecimal.div(factor);
};
