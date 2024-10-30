import React, { useCallback } from 'react';
import InfoIcon from 'src/assets/icons/information-circle.svg';
import { Button, ButtonSizes } from 'src/components/atoms';
import { CardComponent } from 'src/components/molecules';
import { useBreakpoint } from 'src/hooks';
import { useStabilityView } from './context/StabilityViewContext';

export const NoDeposit: React.FC = () => {
    const { dispatchEvent } = useStabilityView();
    const isMobile = useBreakpoint('tablet');

    const handleOpenTrove = useCallback(() => {
        dispatchEvent('DEPOSIT_PRESSED');
    }, [dispatchEvent]);

    return (
        <CardComponent
            title={
                <>
                    Stability Pool
                    {/* <Flex sx={{ justifyContent: 'flex-end' }}>
                    <RemainingProtocolToken />
                </Flex> */}
                </>
            }
            actionComponent={
                <Button
                    onClick={handleOpenTrove}
                    size={isMobile ? ButtonSizes.sm : undefined}
                >
                    Deposit
                </Button>
            }
        >
            <div className='flex items-center gap-1'>
                <InfoIcon className='h-4 w-4' />
                <h3 className='typography-desktop-body-4 font-semibold'>
                    You have no USDFC in the Stability Pool.
                </h3>
            </div>
            <p className='laptop:typography-desktop-body-5 typography-desktop-body-4'>
                You can earn tFIL rewards by depositing USDFC.
            </p>
        </CardComponent>
    );
};
