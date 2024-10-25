import React from 'react';
import { Tooltip } from 'src/components/atoms';
import { Icon } from './Icon';

export const InfoIcon = ({
    placement = 'right',
    message,
}: {
    placement?: Parameters<typeof Tooltip>[0]['placement'];
    message: React.ReactNode;
}) => {
    return (
        <Tooltip
            iconElement={
                <div className='flex items-center'>
                    &nbsp;
                    <Icon name='question-circle' size='1x' />
                </div>
            }
            placement={placement}
        >
            {message}
        </Tooltip>
    );
};
