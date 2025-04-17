import * as amplitude from '@amplitude/analytics-browser';
import { pageViewTrackingPlugin } from '@amplitude/plugin-page-view-tracking-browser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { HashRouter as Router, useLocation } from 'react-router-dom';
import 'src/bigIntPatch';
import { AppLoader } from 'src/components/AppLoader';
import { Icon } from 'src/components/Icon';
import { TransactionProvider } from 'src/components/Transaction';
import { getConfig } from 'src/configs';
import { useAsyncValue } from 'src/hooks/AsyncValue';
import { SfStablecoinProvider } from 'src/hooks/SfStablecoinContext';
import { SfStablecoinFrontend } from 'src/SfStablecoinFrontend';
import store from 'src/store';
import {
    getAmplitudeApiKey,
    getGoogleAnalyticsTag,
    getSupportedChains,
    getWalletConnectId,
    isProdEnv,
} from 'src/utils';
import * as gtag from 'src/utils/gtag';
import 'src/utils/fontawesome';
import { Flex, Heading, Paragraph, ThemeUIProvider } from 'theme-ui';
import { filecoin, filecoinCalibration } from 'viem/chains';
import { http, WagmiProvider } from 'wagmi';
import '../assets/css/index.css';
import theme from '../theme';
import { rpcUrls } from 'src/constants';

const gaTag = getGoogleAnalyticsTag();

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
    </Flex>
);

const UnsupportedNetworkFallback: React.FC = () => {
    return (
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
                <Icon name='exclamation-triangle' /> This protocol is not
                supported on this network.
            </Heading>
            Please switch to{' '}
            {isProdEnv() ? 'Filecoin Mainnet' : 'Filecoin Calibration'}.
        </Flex>
    );
};

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
    name: 'USDFC',
    description: 'Stablecoin',
    url: 'https://app.usdfc.net/', // origin must match your domain & subdomain
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
        [filecoin.id]: http(rpcUrls.mainnet),
        [filecoinCalibration.id]: http(rpcUrls.testnet),
    },
});

createWeb3Modal({
    wagmiConfig,
    projectId,
    enableAnalytics: true,
    enableSwaps: false,
    enableOnramp: false,
});

const TrackingCode = ({ gaTag }: { gaTag: string }) => {
    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaTag}`}
            />
            <Script id='google-analytics' strategy='afterInteractive'>
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', '${gaTag}');

                    window.addEventListener('hashchange', () => {
                        gtag('config', '${gaTag}', {
                            page_path: window.location.pathname + window.location.hash,
                        });
                    });
                    `}
            </Script>
        </>
    );
};

const RouteChangeTracker = ({ gaTag }: { gaTag: string }) => {
    const location = useLocation();

    useEffect(() => {
        const handleRouteChange = (path: string) => {
            try {
                gtag.pageView(path, gaTag);
            } catch (error) {
                console.error('Failed to track page view:', error);
            }
        };

        handleRouteChange(location.pathname);
    }, [location.pathname, gaTag]);

    return null;
};

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>USDFC: FIL-Backed Stablecoin | Secured Finance</title>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                />
            </Head>
            {gaTag && <TrackingCode gaTag={gaTag} />}
            <Provider store={store}>
                <Providers>
                    <RouteChangeTracker gaTag={gaTag} />
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
                            <Router>
                                <SfStablecoinProvider
                                    loader={loader}
                                    unsupportedNetworkFallback={
                                        <UnsupportedNetworkFallback />
                                    }
                                    unsupportedMainnetFallback={
                                        <UnsupportedMainnetFallback />
                                    }
                                >
                                    <TransactionProvider>
                                        <SfStablecoinFrontend loader={loader} />
                                    </TransactionProvider>
                                </SfStablecoinProvider>
                            </Router>
                        </WagmiProvider>
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </CookiesProvider>
            )}
        </ThemeUIProvider>
    );
};

export default App;
