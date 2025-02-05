import { Wallet } from '@ethersproject/wallet';
import {
    Decimal,
    Difference,
    Trove,
} from '@secured-finance/stablecoin-lib-base';
import React, { PropsWithChildren } from 'react';
import { SfStablecoinStoreProvider } from 'src/contexts';
import { useSfStablecoin } from 'src/hooks';
import 'tippy.js/dist/tippy.css'; // Tooltip default style
import { StabilityViewProvider } from './components/Stability/context/StabilityViewProvider';
import { StakingViewProvider } from './components/Staking/context/StakingViewProvider';
import { TransactionMonitor } from './components/Transaction';
import { TroveViewProvider } from './components/Trove/context/TroveViewProvider';

type SfStablecoinFrontendProps = PropsWithChildren<{
    loader?: React.ReactNode;
}>;

export const SfStablecoinFrontend: React.FC<SfStablecoinFrontendProps> = ({
    loader,
    children,
}) => {
    const { account, provider, sfStablecoin } = useSfStablecoin();

    // For console tinkering ;-)
    Object.assign(window, {
        account,
        provider,
        sfStablecoin,
        Trove,
        Decimal,
        Difference,
        Wallet,
    });

    return (
        <SfStablecoinStoreProvider {...{ loader }} store={sfStablecoin.store}>
            <TroveViewProvider>
                <StabilityViewProvider>
                    <StakingViewProvider>{children}</StakingViewProvider>
                </StabilityViewProvider>
            </TroveViewProvider>
            <TransactionMonitor />
        </SfStablecoinStoreProvider>
    );
};
