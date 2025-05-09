import React, { useCallback } from 'react';
import InfoIcon from 'src/assets/icons/information-circle.svg';
import { Button } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { COIN, CURRENCY } from 'src/strings';
import { useAccount } from 'wagmi';
import { useStabilityView } from './context/StabilityViewContext';

export const NoDeposit: React.FC = () => {
    const { dispatchEvent } = useStabilityView();
    const { isConnected } = useAccount();

    const handleOpenTrove = useCallback(() => {
        dispatchEvent('DEPOSIT_PRESSED');
    }, [dispatchEvent]);

    return (
        <CardComponent
            title={
                <>
                    Stability Pool
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
                    <Button disabled={!isConnected} onClick={handleOpenTrove}>
                        Deposit
                    </Button>
                </>
            }
        >
            <div className='flex flex-col gap-1 laptop:gap-2'>
                <div className='flex items-center gap-1'>
                    <InfoIcon className='h-4 w-4' />
                    <h3 className='laptop:typography-desktop-body-3 typography-desktop-body-4 font-semibold'>
                        You have no {COIN} in the Stability Pool.
                    </h3>
                </div>
                <p className='typography-desktop-body-4'>
                    You can earn {CURRENCY} rewards by depositing {COIN}.
                </p>
            </div>
        </CardComponent>
    );
};
