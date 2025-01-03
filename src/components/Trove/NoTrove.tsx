import { t } from 'i18next';
import React, { useCallback } from 'react';
import InfoIcon from 'src/assets/icons/information-circle.svg';
import { Button } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { useTroveView } from './context/TroveViewContext';

export const NoTrove: React.FC = () => {
    const { dispatchEvent } = useTroveView();

    const handleOpenTrove = useCallback(() => {
        dispatchEvent('OPEN_TROVE_PRESSED');
    }, [dispatchEvent]);

    return (
        <CardComponent
            title={t('common.trove')}
            actionComponent={
                <Button onClick={handleOpenTrove}>
                    {t('common.open-trove')}
                </Button>
            }
        >
            <div className='flex flex-col gap-1 laptop:gap-2'>
                <div className='flex items-center gap-1'>
                    <InfoIcon className='h-4 w-4' />
                    <h3 className='laptop:typography-desktop-body-3 typography-desktop-body-4 font-semibold'>
                        {t('card-component.no-deposits')}
                    </h3>
                </div>
                <p className='typography-desktop-body-4'>
                    {t('card-component.no-deposits-desc')}
                </p>
            </div>
        </CardComponent>
    );
};
