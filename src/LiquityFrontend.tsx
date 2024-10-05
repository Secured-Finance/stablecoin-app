import { Wallet } from '@ethersproject/wallet';
import { LiquityStoreProvider } from '@liquity/lib-react';
import { Decimal, Difference, Trove } from '@secured-finance/lib-base';
import React, { PropsWithChildren } from 'react';
import 'tippy.js/dist/tippy.css'; // Tooltip default style
import { StabilityViewProvider } from './components/Stability/context/StabilityViewProvider';
import { StakingViewProvider } from './components/Staking/context/StakingViewProvider';
import { TransactionMonitor } from './components/Transaction';
import { TroveViewProvider } from './components/Trove/context/TroveViewProvider';
import { useLiquity } from './hooks/LiquityContext';

type LiquityFrontendProps = PropsWithChildren<{
    loader?: React.ReactNode;
}>;

export const LiquityFrontend: React.FC<LiquityFrontendProps> = ({
    children,
    loader,
}) => {
    const { account, provider, liquity } = useLiquity();

    // For console tinkering ;-)
    Object.assign(window, {
        account,
        provider,
        liquity,
        Trove,
        Decimal,
        Difference,
        Wallet,
    });

    return (
        <LiquityStoreProvider {...{ loader }} store={liquity.store}>
            <TroveViewProvider>
                <StabilityViewProvider>
                    <StakingViewProvider>{children}</StakingViewProvider>
                </StabilityViewProvider>
            </TroveViewProvider>
            <TransactionMonitor />
        </LiquityStoreProvider>
    );
};
