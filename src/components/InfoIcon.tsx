import { Info } from 'lucide-react';
import React from 'react';
import { Tooltip } from 'src/components/atoms';

export const InfoIcon = ({
    placement = 'right',
    message,
}: {
    placement?: Parameters<typeof Tooltip>[0]['placement'];
    message: React.ReactNode;
}) => {
    return (
        <Tooltip
            iconElement={<Info className='h-3.5 w-3.5 text-neutral-500' />}
            placement={placement}
        >
            {message}
        </Tooltip>
    );
};
