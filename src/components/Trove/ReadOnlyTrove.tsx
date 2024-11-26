import { SfStablecoinStoreState } from '@secured-finance/lib-base';
import React, { useCallback } from 'react';
import { Button, ButtonVariants } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { useSfStablecoinSelector } from 'src/hooks';
import { COLLATERAL_PRECISION } from 'src/utils';
import { COIN } from '../../strings';
import { Icon } from '../Icon';
import { CollateralRatio, CollateralRatioInfoBubble } from './CollateralRatio';
import { useTroveView } from './context/TroveViewContext';
import { DisabledEditableRow } from './Editor';

const select = ({ trove, price }: SfStablecoinStoreState) => ({ trove, price });

export const ReadOnlyTrove: React.FC = () => {
    const { dispatchEvent } = useTroveView();
    const handleAdjustTrove = useCallback(() => {
        dispatchEvent('ADJUST_TROVE_PRESSED');
    }, [dispatchEvent]);
    const handleCloseTrove = useCallback(() => {
        dispatchEvent('CLOSE_TROVE_PRESSED');
    }, [dispatchEvent]);

    const { trove, price } = useSfStablecoinSelector(select);

    // console.log("READONLY TROVE", trove.collateral.prettify(4));
    return (
        <CardComponent
            title='Trove'
            actionComponent={
                <>
                    <Button
                        variant={ButtonVariants.secondary}
                        onClick={handleCloseTrove}
                    >
                        Close Trove
                    </Button>
                    <Button
                        variant={ButtonVariants.primary}
                        onClick={handleAdjustTrove}
                    >
                        <Icon name='pen' size='sm' />
                        &nbsp;Adjust
                    </Button>
                </>
            }
        >
            <div className='flex flex-col gap-3'>
                <DisabledEditableRow
                    label='Collateral'
                    inputId='trove-collateral'
                    amount={trove.collateral.prettify(COLLATERAL_PRECISION)}
                    unit='tFIL'
                />

                <DisabledEditableRow
                    label='Debt'
                    inputId='trove-debt'
                    amount={trove.debt.prettify()}
                    unit={COIN}
                />

                <CollateralRatio value={trove.collateralRatio(price)} />
                <CollateralRatioInfoBubble
                    value={trove.collateralRatio(price)}
                />
            </div>
        </CardComponent>
    );
};
