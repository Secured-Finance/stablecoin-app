import { t } from 'i18next';
import React, { useCallback } from 'react';
import InfoIcon from 'src/assets/icons/information-circle.svg';
import { Button } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { useStabilityView } from './context/StabilityViewContext';

export const NoDeposit: React.FC = () => {
    const { dispatchEvent } = useStabilityView();

    const handleOpenTrove = useCallback(() => {
        dispatchEvent('DEPOSIT_PRESSED');
    }, [dispatchEvent]);

    return (
        <CardComponent
            title={
                <>
                    {t('card-component.stability-pool')}
                    {/* <div className='flex justify-end'>
                        <RemainingProtocolToken />
                    </div> */}
                </>
            }
            actionComponent={
                <>
                    {/* <Flex sx={{
                            justifyContent: 'flex-start',
                            flex: 1,
                            alignItems: 'center',
                        }}
                >
                        <Yield />
                    </Flex> */}
                    <Button onClick={handleOpenTrove}>
                        {t('common.deposit-title')}
                    </Button>
                </>
            }
        >
            <div className='flex flex-col gap-1 laptop:gap-2'>
                <div className='flex items-center gap-1'>
                    <InfoIcon className='h-4 w-4' />
                    <h3 className='laptop:typography-desktop-body-3 typography-desktop-body-4 font-semibold'>
                        {t('card-component.no-stability-pool')}
                    </h3>
                </div>
                <p className='typography-desktop-body-4'>
                    {t('card-component.no-stability-pool-desc')}
                </p>
            </div>
        </CardComponent>
    );
};
