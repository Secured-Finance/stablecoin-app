import {
    Decimal,
    TroveAdjustmentParams,
    TroveChange,
} from '@secured-finance/stablecoin-lib-base';
import { getTrovePriceRestriction } from './oracleRestrictions';

type ValidTroveChange = Exclude<
    TroveChange<Decimal>,
    { type: 'invalidCreation' }
>;

const creation = {
    type: 'creation',
    params: {
        depositCollateral: Decimal.ONE,
        borrowDebtToken: Decimal.ONE,
    },
} as ValidTroveChange;

const closure = {
    type: 'closure',
    params: {
        withdrawCollateral: Decimal.ONE,
        repayDebtToken: Decimal.ONE,
    },
} as ValidTroveChange;

const adjustment = (params: TroveAdjustmentParams<Decimal>) =>
    ({ type: 'adjustment', params } as ValidTroveChange);

describe('getTrovePriceRestriction', () => {
    it('allows all changes with the primary oracle', () => {
        expect(
            getTrovePriceRestriction(creation, 'primaryOracle', false)
        ).toBeUndefined();
    });

    it.each(['fallbackOracle', 'lastGoodPrice'] as const)(
        'blocks Trove creation with %s',
        priceSource => {
            expect(getTrovePriceRestriction(creation, priceSource, false)).toBe(
                'primaryPriceRequired'
            );
        }
    );

    it.each([
        { borrowDebtToken: Decimal.ONE },
        { withdrawCollateral: Decimal.ONE },
        {
            depositCollateral: Decimal.ONE,
            borrowDebtToken: Decimal.ONE,
        },
    ])('blocks risk-increasing adjustments', params => {
        expect(
            getTrovePriceRestriction(
                adjustment(params),
                'fallbackOracle',
                false
            )
        ).toBe('primaryPriceRequired');
    });

    it.each([
        { depositCollateral: Decimal.ONE },
        { repayDebtToken: Decimal.ONE },
        {
            depositCollateral: Decimal.ONE,
            repayDebtToken: Decimal.ONE,
        },
    ])('allows risk-reducing adjustments', params => {
        expect(
            getTrovePriceRestriction(adjustment(params), 'lastGoodPrice', false)
        ).toBeUndefined();
    });

    it('allows closing with a non-primary price', () => {
        expect(
            getTrovePriceRestriction(closure, 'fallbackOracle', false)
        ).toBeUndefined();
    });

    it.each([creation, closure, adjustment({ repayDebtToken: Decimal.ONE })])(
        'blocks price-dependent changes when the price is stale',
        change => {
            expect(
                getTrovePriceRestriction(change, 'lastGoodPrice', true)
            ).toBe('priceUnavailable');
        }
    );

    it('fails closed when the price source is unknown', () => {
        expect(getTrovePriceRestriction(closure, 'unknown', false)).toBe(
            'priceUnavailable'
        );
    });
});
