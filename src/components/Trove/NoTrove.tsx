import React, { useCallback } from 'react';
import InfoIcon from 'src/assets/icons/information-circle.svg';
import { Button } from 'src/components/atoms';
import { useTroveView } from './context/TroveViewContext';

export const CardComponent = ({
    title,
    children,
    actionComponent,
}: {
    title: React.ReactNode;
    children: React.ReactNode;
    actionComponent: React.ReactNode;
}) => {
    return (
        <div className='shadow mt-8 flex flex-col rounded-b-xl bg-neutral-50'>
            <div className='h-[42px] border-t-4 border-primary-500 bg-neutral-200 px-3.5 py-2 font-semibold leading-[22px] text-neutral-900'>
                <h2 className='flex items-center justify-between'>{title}</h2>
            </div>
            <div className='flex flex-col gap-2 px-4 pb-4 pt-3'>
                {children}
                {actionComponent && (
                    <div className='flex justify-end gap-2'>
                        {actionComponent}
                    </div>
                )}
            </div>
        </div>
    );
};

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
            <div className='flex items-center gap-1'>
                <InfoIcon className='h-4 w-4' />
                <h3 className='typography-desktop-body-4 font-semibold'>
                    You haven&apos;t borrowed any USDFC yet.
                </h3>
            </div>
            <p className='typography-desktop-body-5'>
                You can mint and borrow USDFC by opening a Trove.
            </p>
        </CardComponent>
    );
};
