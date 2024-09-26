import { Wallet } from '@ethersproject/wallet';
import { Decimal, Difference, Trove } from '@liquity/lib-base';
import { LiquityStoreProvider } from '@liquity/lib-react';
import React from 'react';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import { RiskyTrovesPage } from 'src/components//pages/RiskyTrovesPage';
import { PageSwitcher } from 'src/components/pages/PageSwitcher';
import { Container, Flex } from 'theme-ui';
import 'tippy.js/dist/tippy.css'; // Tooltip default style
import { Header } from './components/Header';
import { StabilityViewProvider } from './components/Stability/context/StabilityViewProvider';
import { StakingViewProvider } from './components/Staking/context/StakingViewProvider';
import { SystemStatsPopup } from './components/SystemStatsPopup';
import { TransactionMonitor } from './components/Transaction';
import { TroveViewProvider } from './components/Trove/context/TroveViewProvider';
import { UserAccount } from './components/UserAccount';
import { useLiquity } from './hooks/LiquityContext';

type LiquityFrontendProps = {
    loader?: React.ReactNode;
};

export const LiquityFrontend: React.FC<LiquityFrontendProps> = ({ loader }) => {
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
            <Router>
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
                                    <UserAccount />
                                    <SystemStatsPopup />
                                </Header>

                                <Container
                                    variant='main'
                                    sx={{
                                        display: 'flex',
                                        flexGrow: 1,
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Switch>
                                        <Route path='/' exact>
                                            <PageSwitcher />
                                        </Route>
                                        <Route path='/risky-troves'>
                                            <RiskyTrovesPage />
                                        </Route>
                                    </Switch>
                                </Container>
                            </Flex>
                        </StakingViewProvider>
                    </StabilityViewProvider>
                </TroveViewProvider>
            </Router>
            <TransactionMonitor />
        </LiquityStoreProvider>
    );
};
