/* eslint-disable no-console */
import { Decimal, TroveChange } from '@secured-finance/stablecoin-lib-base';
import { PopulatedEthersTransaction } from '@secured-finance/stablecoin-lib-ethers';
import React, { useEffect } from 'react';
import { useSfStablecoin } from 'src/hooks';
import { WarningBubble } from '../WarningBubble';

export type GasEstimationState =
    | { type: 'idle' | 'inProgress' }
    | { type: 'complete'; populatedTx: PopulatedEthersTransaction };

type ExpensiveTroveChangeWarningParams = {
    troveChange?: Exclude<TroveChange<Decimal>, { type: 'invalidCreation' }>;
    maxBorrowingRate: Decimal;
    borrowingFeeDecayToleranceMinutes: number;
    gasEstimationState: GasEstimationState;
    setGasEstimationState: (newState: GasEstimationState) => void;
};

export const ExpensiveTroveChangeWarning: React.FC<
    ExpensiveTroveChangeWarningParams
> = ({
    troveChange,
    maxBorrowingRate,
    borrowingFeeDecayToleranceMinutes,
    gasEstimationState,
    setGasEstimationState,
}) => {
    const { sfStablecoin } = useSfStablecoin();

    useEffect(() => {
        if (troveChange && troveChange.type !== 'closure') {
            setGasEstimationState({ type: 'inProgress' });

            let cancelled = false;

            const timeoutId = setTimeout(async () => {
                const populatedTx = await (troveChange.type === 'creation'
                    ? sfStablecoin.populate.openTrove(troveChange.params, {
                          maxBorrowingRate,
                          borrowingFeeDecayToleranceMinutes,
                      })
                    : sfStablecoin.populate.adjustTrove(troveChange.params, {
                          maxBorrowingRate,
                          borrowingFeeDecayToleranceMinutes,
                      }));

                if (!cancelled) {
                    setGasEstimationState({ type: 'complete', populatedTx });
                    console.log(
                        'Estimated TX cost: ' +
                            Decimal.from(
                                `${populatedTx.rawPopulatedTransaction.gasLimit}`
                            ).prettify(0)
                    );
                }
            }, 333);

            return () => {
                clearTimeout(timeoutId);
                cancelled = true;
            };
        } else {
            setGasEstimationState({ type: 'idle' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [troveChange]);

    if (
        troveChange &&
        gasEstimationState.type === 'complete' &&
        gasEstimationState.populatedTx.gasHeadroom !== undefined &&
        gasEstimationState.populatedTx.gasHeadroom >= 200000
    ) {
        return troveChange.type === 'creation' ? (
            <WarningBubble>
                The cost of opening a Trove in this collateral ratio range is
                rather high. To lower it, choose a slightly different collateral
                ratio.
            </WarningBubble>
        ) : (
            <WarningBubble>
                The cost of adjusting a Trove into this collateral ratio range
                is rather high. To lower it, choose a slightly different
                collateral ratio.
            </WarningBubble>
        );
    }

    return null;
};
