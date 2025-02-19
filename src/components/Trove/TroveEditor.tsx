import {
    Decimal,
    Decimalish,
    LIQUIDATION_RESERVE,
    SfStablecoinStoreState,
    Trove,
} from '@secured-finance/stablecoin-lib-base';
import React from 'react';
import { CardComponent } from 'src/components/templates';
import { useSfStablecoinSelector } from 'src/hooks';
import { COLLATERAL_PRECISION } from 'src/utils';
import { Card } from 'theme-ui';
import { COIN } from '../../strings';
import { InfoIcon } from '../InfoIcon';
import { LoadingOverlay } from '../LoadingOverlay';
import { AmountChange, StaticRow } from './Editor';

type TroveEditorProps = React.PropsWithChildren<{
    original: Trove;
    edited: Trove;
    changePending: boolean;
    dispatch: (
        action:
            | { type: 'setCollateral' | 'setDebt'; newValue: Decimalish }
            | { type: 'revert' }
    ) => void;
}>;

const select = ({ debtTokenBalance }: SfStablecoinStoreState) => ({
    debtTokenBalance,
});

// XXX Only used for closing Troves now
export const TroveEditor: React.FC<TroveEditorProps> = ({
    children,
    original,
    edited,
    changePending,
}) => {
    const { debtTokenBalance } = useSfStablecoinSelector(select);

    return (
        <CardComponent title='Trove'>
            <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-3 px-3'>
                    <StaticRow label='Collateral' inputId='trove-collateral'>
                        <AmountChange
                            from={original.collateral.prettify(
                                COLLATERAL_PRECISION
                            )}
                            to={edited.collateral.prettify(
                                COLLATERAL_PRECISION
                            )}
                            unit='tFIL'
                        />
                    </StaticRow>

                    <StaticRow label='Net debt' inputId='trove-net-debt'>
                        <AmountChange
                            from={original.netDebt.prettify(
                                COLLATERAL_PRECISION
                            )}
                            to={
                                original.netDebt.gte(debtTokenBalance)
                                    ? original.netDebt
                                          .sub(debtTokenBalance)
                                          .prettify(COLLATERAL_PRECISION)
                                    : Decimal.ZERO.prettify(
                                          COLLATERAL_PRECISION
                                      )
                            }
                            unit={COIN}
                        />
                    </StaticRow>

                    <StaticRow
                        label='Liquidation Reserve'
                        inputId='trove-liquidation-reserve'
                        infoIcon={
                            <InfoIcon
                                message={
                                    <Card
                                        variant='tooltip'
                                        sx={{ width: '200px' }}
                                    >
                                        An amount set aside to cover the
                                        liquidator’s gas costs if your Trove
                                        needs to be liquidated. The amount
                                        increases your debt and is refunded if
                                        you close your Trove by fully paying off
                                        its net debt.
                                    </Card>
                                }
                            />
                        }
                    >
                        <AmountChange
                            from={`${LIQUIDATION_RESERVE}`}
                            to={`${
                                original.isEmpty ? LIQUIDATION_RESERVE : '0'
                            }`}
                            unit={COIN}
                        />
                    </StaticRow>
                </div>

                <div className='flex flex-col gap-3'>{children}</div>
            </div>

            {changePending && <LoadingOverlay />}
        </CardComponent>
    );
};
