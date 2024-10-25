import React from 'react';
import QuestionIcon from 'src/assets/icons/question-line.svg';
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
            iconElement={<QuestionIcon className='ml-0.5 h-4 w-4' />}
            placement={placement}
        >
            {message}
        </Tooltip>
    );
};
