import React, { useCallback } from 'react';
import InfoIcon from 'src/assets/icons/information-circle.svg';
import { Button } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { Flex } from 'theme-ui';
import { useStabilityView } from './context/StabilityViewContext';
import { RemainingProtocolToken } from './RemainingProtocolToken';

export const NoDeposit: React.FC = () => {
    const { dispatchEvent } = useStabilityView();

    const handleOpenTrove = useCallback(() => {
        dispatchEvent('DEPOSIT_PRESSED');
    }, [dispatchEvent]);

    return (
        <CardComponent
            title={
                <>
                    Stability Pool
                    <Flex sx={{ justifyContent: 'flex-end' }}>
                        <RemainingProtocolToken />
                    </Flex>
                </>
            }
            actionComponent={<Button onClick={handleOpenTrove}>Deposit</Button>}
        >
            <div className='flex flex-col gap-1 laptop:gap-2'>
                <div className='flex items-center gap-1'>
                    <InfoIcon className='h-4 w-4' />
                    <h3 className='typography-desktop-body-4 font-semibold'>
                        You have no USDFC in the Stability Pool.
                    </h3>
                </div>
                <p className='laptop:typography-desktop-body-5 typography-desktop-body-4'>
                    You can earn tFIL rewards by depositing USDFC.
                </p>
            </div>
        </CardComponent>
    );
};
