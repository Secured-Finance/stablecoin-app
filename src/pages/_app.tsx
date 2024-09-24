import * as amplitude from '@amplitude/analytics-browser';
import { pageViewTrackingPlugin } from '@amplitude/plugin-page-view-tracking-browser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import 'src/bigIntPatch';
import { Loader } from 'src/components/atoms';
import { Header } from 'src/components/organisms';
import { WalletConnector } from 'src/components/organisms/WalletConnector/WalletConnector';
import { Layout } from 'src/components/templates';
import { LiquityFrontendProvider, LiquityProvider } from 'src/contexts';
import { TransactionProvider } from 'src/hooks/useTransactionFunction';
import store from 'src/store';
import {
    getAmplitudeApiKey,
    getSupportedChains,
    getWalletConnectId,
} from 'src/utils';
import { filecoin, filecoinCalibration, mainnet, sepolia } from 'viem/chains';
import { http, WagmiProvider } from 'wagmi';
import '../assets/css/index.css';

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '';
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

const config = defaultWagmiConfig({
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
        [filecoin.id]: http(),
        [filecoinCalibration.id]: http(),
        [mainnet.id]: http(
            `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
        ),
        [sepolia.id]: http(
            `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`
        ),
    },
});

createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true,
    enableSwaps: false,
    enableOnramp: false,
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
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='light'
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Layout navBar={<Header />}>
                            <Component {...pageProps} />
                        </Layout>
                    </ThemeProvider>
                </Providers>
            </Provider>
        </>
    );
}

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <CookiesProvider>
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={config}>
                    <WalletConnector>
                        <TransactionProvider>
                            <LiquityProvider loader={<Loader />}>
                                <LiquityFrontendProvider>
                                    {children}
                                </LiquityFrontendProvider>
                            </LiquityProvider>
                        </TransactionProvider>
                    </WalletConnector>
                </WagmiProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </CookiesProvider>
    );
};

export default App;
