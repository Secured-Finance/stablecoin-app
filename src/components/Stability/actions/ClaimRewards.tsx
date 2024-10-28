import React from 'react';
import { Button } from 'src/components/atoms';
import { useSfStablecoin } from 'src/hooks';
import { useTransactionFunction } from '../../Transaction';

type ClaimRewardsProps = React.PropsWithChildren<{
    disabled?: boolean;
}>;

export const ClaimRewards: React.FC<ClaimRewardsProps> = ({
    disabled,
    children,
}) => {
    const { sfStablecoin } = useSfStablecoin();

    const [sendTransaction] = useTransactionFunction(
        'stability-deposit',
        sfStablecoin.send.withdrawGainsFromStabilityPool.bind(sfStablecoin.send)
    );

    return (
        <Button onClick={sendTransaction} disabled={disabled}>
            {children}
        </Button>
    );
};
