import React from 'react';
import { useLiquity } from 'src/hooks';
import { Button } from 'theme-ui';
import { useTransactionFunction } from '../../Transaction';

type ClaimAndMoveProps = React.PropsWithChildren<{
    disabled?: boolean;
}>;

export const ClaimAndMove: React.FC<ClaimAndMoveProps> = ({
    disabled,
    children,
}) => {
    const { liquity } = useLiquity();

    const [sendTransaction] = useTransactionFunction(
        'stability-deposit',
        liquity.send.transferCollateralGainToTrove.bind(liquity.send)
    );

    return (
        <Button
            variant='outline'
            sx={{ mt: 3, width: '100%' }}
            onClick={sendTransaction}
            disabled={disabled}
        >
            {children}
        </Button>
    );
};
