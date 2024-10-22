import { Wallet } from '@ethersproject/wallet';
import { Decimal, Difference, Trove } from '@secured-finance/lib-base';
import React from 'react';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import { RiskyTrovesPage } from 'src/components//pages/RiskyTrovesPage';
import { PageSwitcher } from 'src/components/pages/PageSwitcher';
import { SfStablecoinStoreProvider } from 'src/contexts';
import { useSfStablecoin } from 'src/hooks';
import { Container, Flex } from 'theme-ui';
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
        </SfStablecoinStoreProvider>
    );
};
