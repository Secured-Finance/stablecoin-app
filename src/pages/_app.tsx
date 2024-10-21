import * as amplitude from '@amplitude/analytics-browser';
import { pageViewTrackingPlugin } from '@amplitude/plugin-page-view-tracking-browser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import 'src/bigIntPatch';
import { AppLoader } from 'src/components/AppLoader';
import { Icon } from 'src/components/Icon';
import { TransactionProvider } from 'src/components/Transaction';
import { WalletConnector } from 'src/components/WalletConnector';
import { getConfig } from 'src/config';
import { useAsyncValue } from 'src/hooks/AsyncValue';
import { LiquityProvider } from 'src/hooks/LiquityContext';
import { LiquityFrontend } from 'src/LiquityFrontend';
import store from 'src/store';
import {
    getAmplitudeApiKey,
    getSupportedChains,
    getWalletConnectId,
} from 'src/utils';
import { Flex, Heading, Link, Paragraph, ThemeUIProvider } from 'theme-ui';
import { filecoin, filecoinCalibration } from 'viem/chains';
import { http, WagmiProvider } from 'wagmi';
import '../assets/css/index.css';
import theme from '../theme';

const ankerApiKey = process.env.NEXT_PUBLIC_ANKER_API_KEY ?? '';

// Start pre-fetching the config
// getConfig().then(config => {
//     // console.log("Frontend config:");
//     // console.log(config);
//     Object.assign(window, { config });
// });

const UnsupportedMainnetFallback: React.FC = () => (
    <Flex
        sx={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
        }}
    >
        <Heading sx={{ mb: 3 }}>
            <Icon name='exclamation-triangle' /> This app is for testing
            purposes only.
        </Heading>

        <Paragraph sx={{ mb: 3 }}>
            Please change your network to Filecoin Calibration.
        </Paragraph>

        <Paragraph>
            If you would like to use this protocol on mainnet, please pick a
            frontend{' '}
            <Link href='https://www.liquity.org/frontend'>
                here <Icon name='external-link-alt' size='xs' />
            </Link>
            .
        </Paragraph>
    </Flex>
);

const UnsupportedNetworkFallback: React.FC = () => (
    <Flex
        sx={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
        }}
    >
        <Heading sx={{ mb: 3 }}>
            <Icon name='exclamation-triangle' /> This protocol is not supported
            on this network.
        </Heading>
        Please switch to Filecoin or Filecoin Calibration.
    </Flex>
);

const projectId = getWalletConnectId();

const queryClient = new QueryClient();

if (typeof window !== 'undefined') {
    const pageViewTracking = pageViewTrackingPlugin({
        trackOn: undefined,
        trackHistoryChanges: undefined,
    });

    amplitude.add(pageViewTracking);
    amplitude.init(getAmplitudeApiKey(), {
        appVersion: process.env.SF_ENV,
        logLevel: amplitude.Types.LogLevel.None,
    });
}

const metadata = {
    name: 'Stablecoin',
    description: 'AppKit Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const network = getSupportedChains();

const wagmiConfig = defaultWagmiConfig({
    chains: network,
    projectId: projectId,
    metadata,
    ssr: true,
    auth: {
        email: false,
        socials: undefined,
        showWallets: true,
        walletFeatures: false,
    },
    transports: {
        [filecoin.id]: http(`https://rpc.ankr.com/filecoin/${ankerApiKey}`),
        [filecoinCalibration.id]: http(
            `https://rpc.ankr.com/filecoin_testnet/${ankerApiKey}`
        ),
    },
});

createWeb3Modal({
    wagmiConfig,
    projectId,
    enableAnalytics: true,
    enableSwaps: false,
    enableOnramp: false,
    allowUnsupportedChain: true,
});

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Secured Finance</title>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                />
            </Head>
            <Provider store={store}>
                <Providers>
                    <Component {...pageProps} />
                </Providers>
            </Provider>
        </>
    );
}

const Providers: React.FC<{ children: React.ReactNode }> = () => {
    const config = useAsyncValue(getConfig);
    const loader = <AppLoader />;

    return (
        <ThemeUIProvider theme={theme}>
            {config.loaded && (
                <CookiesProvider>
                    <QueryClientProvider client={queryClient}>
                        <WagmiProvider config={wagmiConfig}>
                            <WalletConnector>
                                <LiquityProvider
                                    loader={loader}
                                    unsupportedNetworkFallback={
                                        <UnsupportedNetworkFallback />
                                    }
                                    unsupportedMainnetFallback={
                                        <UnsupportedMainnetFallback />
                                    }
                                >
                                    <TransactionProvider>
                                        <LiquityFrontend loader={loader} />
                                    </TransactionProvider>
                                </LiquityProvider>
                            </WalletConnector>
                        </WagmiProvider>
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </CookiesProvider>
            )}
        </ThemeUIProvider>
    );
};

export default App;
