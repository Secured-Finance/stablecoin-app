import { SfStablecoinStoreState } from '@secured-finance/lib-base';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonVariants } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { useSfStablecoinSelector } from 'src/hooks';
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

    const { t } = useTranslation();

    return (
        <CardComponent
            title={t('common.trove')}
            actionComponent={
                <>
                    <Button
                        variant={ButtonVariants.secondary}
                        onClick={handleCloseTrove}
                    >
                        {t('card-component.close-trove')}
                    </Button>
                    <Button
                        variant={ButtonVariants.primary}
                        onClick={handleAdjustTrove}
                    >
                        <Icon name='pen' size='sm' />
                        &nbsp;{t('common.adjust')}
                    </Button>
                </>
            }
        >
            <div className='flex flex-col gap-3'>
                <DisabledEditableRow
                    label={t('common.collateral')}
                    inputId='trove-collateral'
                    amount={trove.collateral.prettify(4)}
                    unit='tFIL'
                />

                <DisabledEditableRow
                    label={t('common.debt')}
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
