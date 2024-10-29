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
            title='Trove'
            actionComponent={
                <Button onClick={handleOpenTrove}>Open Trove</Button>
            }
        >
            <div className='flex flex-col gap-1 laptop:gap-2'>
                <div className='flex items-center gap-1'>
                    <InfoIcon className='h-4 w-4' />
                    <h3 className='typography-desktop-body-4 font-semibold'>
                        You haven&apos;t borrowed any USDFC yet.
                    </h3>
                </div>
                <p className='laptop:typography-desktop-body-5 typography-desktop-body-4'>
                    You can mint and borrow USDFC by opening a Trove.
                </p>
            </div>
        </CardComponent>
    );
};
