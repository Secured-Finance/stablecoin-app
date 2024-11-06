import { Info } from 'lucide-react';
import React from 'react';
import { Tooltip } from 'src/components/atoms';

export const InfoIcon = ({
    placement = 'right',
    message,
    Icon,
}: {
    placement?: Parameters<typeof Tooltip>[0]['placement'];
    message: React.ReactNode;
    Icon?: React.ElementType;
}) => {
    const DisplayIcon = Icon ?? Info;
    return (
        <Tooltip
            iconElement={<DisplayIcon className='h-4 w-4 text-neutral-500' />}
            placement={placement}
        >
            {message}
        </Tooltip>
    );
};
