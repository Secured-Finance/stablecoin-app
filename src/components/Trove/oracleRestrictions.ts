import {
    Decimal,
    PriceSource,
    TroveChange,
} from '@secured-finance/stablecoin-lib-base';

export type TrovePriceRestriction = 'priceUnavailable' | 'primaryPriceRequired';

type ValidTroveChange = Exclude<
    TroveChange<Decimal>,
    { type: 'invalidCreation' }
>;

export const getTrovePriceRestriction = (
    change: ValidTroveChange,
    priceSource: PriceSource,
    isPriceStale: boolean
): TrovePriceRestriction | undefined => {
    if (isPriceStale || priceSource === 'unknown') {
        return 'priceUnavailable';
    }

    if (priceSource === 'primaryOracle' || change.type === 'closure') {
        return undefined;
    }

    if (change.type === 'creation') {
        return 'primaryPriceRequired';
    }

    return change.params.borrowDebtToken !== undefined ||
        change.params.withdrawCollateral !== undefined
        ? 'primaryPriceRequired'
        : undefined;
};
