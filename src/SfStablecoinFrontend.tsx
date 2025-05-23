import { Wallet } from '@ethersproject/wallet';
import {
    Decimal,
    Difference,
    Trove,
} from '@secured-finance/stablecoin-lib-base';
import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { BridgePage } from 'src/components/pages/BridgePage';
import { PageSwitcher } from 'src/components/pages/PageSwitcher';
import { RedemptionPage } from 'src/components/pages/RedemptionPage';
import { RiskyTrovesPage } from 'src/components/pages/RiskyTrovesPage';
import { SfStablecoinStoreProvider } from 'src/contexts';
import { useSfStablecoin } from 'src/hooks';
import { Flex } from 'theme-ui';
import 'tippy.js/dist/tippy.css'; // Tooltip default style
import { Header } from './components/Header';
import { StabilityViewProvider } from './components/Stability/context/StabilityViewProvider';
import { StakingViewProvider } from './components/Staking/context/StakingViewProvider';
import { SystemStatsPopup } from './components/SystemStatsPopup';
import { TransactionMonitor } from './components/Transaction';
import { TroveViewProvider } from './components/Trove/context/TroveViewProvider';
import { UserAccount } from './components/UserAccount';

type SfStablecoinFrontendProps = {
    loader?: React.ReactNode;
};

const AnimatedSwitch: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const location = useLocation();

    return (
        <TransitionGroup className='relative w-full'>
            <CSSTransition
                key={location.pathname}
                classNames='fade'
                timeout={300}
            >
                <Switch location={location}>{children}</Switch>
            </CSSTransition>
        </TransitionGroup>
    );
};

export const SfStablecoinFrontend: React.FC<SfStablecoinFrontendProps> = ({
    loader,
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
                    <StakingViewProvider>
                        <Flex
                            sx={{
                                flexDirection: 'column',
                                minHeight: '100%',
                            }}
                        >
                            <Header>
                                <div className='flex items-center gap-2'>
                                    <UserAccount />
                                    <SystemStatsPopup />
                                </div>
                            </Header>
                            <div className='m-0 mx-auto mb-10 mt-14 flex w-full max-w-[1280px] flex-grow flex-col items-center px-5 pb-16 laptop:mt-16'>
                                <AnimatedSwitch>
                                    <Route path='/' exact>
                                        <PageSwitcher />
                                    </Route>
                                    <Route path='/risky-troves'>
                                        <RiskyTrovesPage />
                                    </Route>
                                    <Route path='/redemption'>
                                        <RedemptionPage />
                                    </Route>
                                    <Route path='/bridge'>
                                        <BridgePage />
                                    </Route>
                                </AnimatedSwitch>
                            </div>
                        </Flex>
                    </StakingViewProvider>
                </StabilityViewProvider>
            </TroveViewProvider>
            <TransactionMonitor />
        </SfStablecoinStoreProvider>
    );
};
