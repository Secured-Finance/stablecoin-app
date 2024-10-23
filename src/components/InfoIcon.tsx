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
            iconElement={<Icon name='question-circle' size='1x' />}
            placement={placement}
        >
            {message}
        </Tooltip>
    );
};
