import * as amplitude from '@amplitude/analytics-browser';
import { pageViewTrackingPlugin } from '@amplitude/plugin-page-view-tracking-browser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import 'src/bigIntPatch';
import { Layout } from 'src/components/templates';
import store from 'src/store';
import { getAmplitudeApiKey, getWalletConnectId } from 'src/utils';
import { filecoin, filecoinCalibration, mainnet, sepolia } from 'viem/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';
import '../assets/css/index.css';

const Header = dynamic(() => import('src/components/organisms/Header/Header'), {
    ssr: false,
});

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

const config = createConfig({
    chains: [mainnet, filecoin, sepolia, filecoinCalibration],
    transports: {
        [mainnet.id]: http(),
        [filecoin.id]: http(),
        [sepolia.id]: http(),
        [filecoinCalibration.id]: http(),
    },
    connectors: [
        metaMask(),
        walletConnect({
            projectId: projectId,
            qrModalOptions: {
                themeVariables: {
                    '--wcm-font-family': "'Suisse International', sans-serif",
                    '--wcm-accent-color': '#002133',
                    '--wcm-background-color': '#5162FF',
                },
            },
            showQrModal: false,
        }),
        injected(),
    ],
});

createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: false,
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
                <WagmiProvider config={config}>{children}</WagmiProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </CookiesProvider>
    );
};

export default App;
