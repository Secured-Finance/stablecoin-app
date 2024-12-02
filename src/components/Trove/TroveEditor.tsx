import {
    Decimal,
    Decimalish,
    Difference,
    LIQUIDATION_RESERVE,
    Percent,
    SfStablecoinStoreState,
    Trove,
} from '@secured-finance/lib-base';
import { t } from 'i18next';
import React from 'react';
import { CardComponent } from 'src/components/templates';
import { useSfStablecoinSelector } from 'src/hooks';
import { COLLATERAL_PRECISION } from 'src/utils';
import { Card } from 'theme-ui';
import { COIN } from '../../strings';
import { InfoIcon } from '../InfoIcon';
import { LoadingOverlay } from '../LoadingOverlay';
import { CollateralRatio } from './CollateralRatio';
import { StaticRow } from './Editor';

type TroveEditorProps = React.PropsWithChildren<{
    original: Trove;
    edited: Trove;
    fee: Decimal;
    borrowingRate: Decimal;
    changePending: boolean;
    dispatch: (
        action:
            | { type: 'setCollateral' | 'setDebt'; newValue: Decimalish }
            | { type: 'revert' }
    ) => void;
}>;

const select = ({ price }: SfStablecoinStoreState) => ({ price });

// XXX Only used for closing Troves now
export const TroveEditor: React.FC<TroveEditorProps> = ({
    children,
    original,
    edited,
    fee,
    borrowingRate,
    changePending,
}) => {
    const { price } = useSfStablecoinSelector(select);

    const feePct = new Percent(borrowingRate);

    const originalCollateralRatio = !original.isEmpty
        ? original.collateralRatio(price)
        : undefined;
    const collateralRatio = !edited.isEmpty
        ? edited.collateralRatio(price)
        : undefined;
    const collateralRatioChange = Difference.between(
        collateralRatio,
        originalCollateralRatio
    );

    return (
        <CardComponent title='Trove'>
            <div className='flex flex-col gap-3'>
                <StaticRow
                    label={t('common.collateral')}
                    inputId='trove-collateral'
                    amount={edited.collateral.prettify(COLLATERAL_PRECISION)}
                    unit='tFIL'
                />

                <StaticRow
                    label={t('common.debt')}
                    inputId='trove-debt'
                    amount={edited.debt.prettify()}
                    unit={COIN}
                />

                {original.isEmpty && (
                    <StaticRow
                        label={t('common.liquidation-reserve')}
                        inputId='trove-liquidation-reserve'
                        amount={`${LIQUIDATION_RESERVE}`}
                        unit={COIN}
                        infoIcon={
                            <InfoIcon
                                message={
                                    <Card
                                        variant='tooltip'
                                        sx={{ width: '200px' }}
                                    >
                                        {t('tooltips.liquidation-reserve')}
                                    </Card>
                                }
                            />
                        }
                    />
                )}

                <StaticRow
                    label={t('common.borrowing-fee')}
                    inputId='trove-borrowing-fee'
                    amount={fee.toString(2)}
                    pendingAmount={feePct.toString(2)}
                    unit={COIN}
                    infoIcon={
                        <InfoIcon
                            message={
                                <Card variant='tooltip' sx={{ width: '240px' }}>
                                    {t('tooltips.borrowing-fee')}
                                </Card>
                            }
                        />
                    }
                />

                <CollateralRatio
                    value={collateralRatio}
                    change={collateralRatioChange}
                />

                {children}
            </div>
            {changePending && <LoadingOverlay />}
        </CardComponent>
    );
};
