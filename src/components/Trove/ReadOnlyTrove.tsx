import { SfStablecoinStoreState } from '@secured-finance/lib-base';
import React, { useCallback } from 'react';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
import { CardComponent } from 'src/components/molecules';
import { useBreakpoint, useSfStablecoinSelector } from 'src/hooks';
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
    const isMobile = useBreakpoint('tablet');

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
                        size={isMobile ? ButtonSizes.sm : undefined}
                    >
                        Close Trove
                    </Button>
                    <Button
                        variant={ButtonVariants.primary}
                        onClick={handleAdjustTrove}
                        size={isMobile ? ButtonSizes.sm : undefined}
                    >
                        <Icon name='pen' size='sm' />
                        &nbsp;Adjust
                    </Button>
                </>
            }
        >
            <DisabledEditableRow
                label='Collateral'
                inputId='trove-collateral'
                amount={trove.collateral.prettify(4)}
                unit='tFIL'
            />

            <DisabledEditableRow
                label='Debt'
                inputId='trove-debt'
                amount={trove.debt.prettify()}
                unit={COIN}
            />

            <CollateralRatio value={trove.collateralRatio(price)} />
            <CollateralRatioInfoBubble value={trove.collateralRatio(price)} />
        </CardComponent>
    );
};
