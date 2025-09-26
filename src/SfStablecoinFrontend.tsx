import { Wallet } from '@ethersproject/wallet';
import {
    Decimal,
    Difference,
    Trove,
} from '@secured-finance/stablecoin-lib-base';
import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Footer } from 'src/components/molecules';
import { BridgePage } from 'src/components/pages/BridgePage';
import { PageSwitcher } from 'src/components/pages/PageSwitcher';
import { RiskyTrovesPage } from 'src/components/pages/RiskyTrovesPage';
import { SfStablecoinStoreProvider } from 'src/contexts';
import { useSfStablecoin } from 'src/hooks';
import { Flex } from 'theme-ui';
import 'tippy.js/dist/tippy.css'; // Tooltip default style
import { Header } from './components/Header';
import { RedemptionPage } from './components/pages/RedemptionPage';
import { TrovePage } from './components/pages/TrovePage';
import { StabilityViewProvider } from './components/Stability/context/StabilityViewProvider';
import { Stability } from './components/Stability/Stability';
import { StakingViewProvider } from './components/Staking/context/StakingViewProvider';
import { TransactionMonitor } from './components/Transaction';
import { TroveViewProvider } from './components/Trove/context/TroveViewProvider';

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
                                minHeight: '100vh',
                                background: '#FAFAFA',
                            }}
                        >
                            <Header />
                            <div className='m-0 mx-auto mt-14 flex w-full max-w-dashboard flex-grow flex-col items-center px-5 py-8'>
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
                                    <Route path='/trove'>
                                        <TrovePage />
                                    </Route>
                                    <Route path='/stability-pool'>
                                        <Stability />
                                    </Route>
                                </AnimatedSwitch>
                            </div>
                            <Footer />
                        </Flex>
                    </StakingViewProvider>
                </StabilityViewProvider>
            </TroveViewProvider>
            <TransactionMonitor />
        </SfStablecoinStoreProvider>
    );
};
