import React from 'react';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
import { useSfStablecoin } from 'src/hooks';
import { useTransactionFunction } from '../../Transaction';

type ClaimAndMoveProps = React.PropsWithChildren<{
    disabled?: boolean;
}>;

export const ClaimAndMove: React.FC<ClaimAndMoveProps> = ({
    disabled,
    children,
}) => {
    const { sfStablecoin } = useSfStablecoin();

    const [sendTransaction] = useTransactionFunction(
        'stability-deposit',
        sfStablecoin.send.transferCollateralGainToTrove.bind(sfStablecoin.send)
    );

    return (
        <Button
            variant={ButtonVariants.secondary}
            size={ButtonSizes.lg}
            onClick={sendTransaction}
            disabled={disabled}
            fullWidth
        >
            {children}
        </Button>
    );
};
