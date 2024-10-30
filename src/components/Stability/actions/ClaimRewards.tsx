import React from 'react';
import { Button, ButtonSizes } from 'src/components/atoms';
import { useBreakpoint, useSfStablecoin } from 'src/hooks';
import { useTransactionFunction } from '../../Transaction';

type ClaimRewardsProps = React.PropsWithChildren<{
    disabled?: boolean;
}>;

export const ClaimRewards: React.FC<ClaimRewardsProps> = ({
    disabled,
    children,
}) => {
    const { sfStablecoin } = useSfStablecoin();
    const isMobile = useBreakpoint('tablet');

    const [sendTransaction] = useTransactionFunction(
        'stability-deposit',
        sfStablecoin.send.withdrawGainsFromStabilityPool.bind(sfStablecoin.send)
    );

    return (
        <Button
            onClick={sendTransaction}
            size={isMobile ? ButtonSizes.sm : undefined}
            disabled={disabled}
        >
            {children}
        </Button>
    );
};
