import * as amplitude from '@amplitude/analytics-browser';
import { pageViewTrackingPlugin } from '@amplitude/plugin-page-view-tracking-browser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import 'src/bigIntPatch';
import store from 'src/store';
import {
    getAmplitudeApiKey,
    getSupportedChainIds,
    getSupportedNetworks,
    getWalletConnectId,
} from 'src/utils';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import '../assets/css/index.css';

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

const chainIds = getSupportedChainIds();
const networks = getSupportedNetworks().filter(chain =>
    chainIds.includes(chain.id)
);

const { chains, publicClient } = configureChains(networks, [
    alchemyProvider({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '',
    }),
    publicProvider(),
]);

const config = createConfig({
    autoConnect: false,
    publicClient: publicClient,
    connectors: [
        new MetaMaskConnector({ chains }),
        new WalletConnectConnector({
            chains,
            options: {
                projectId: projectId,
                qrModalOptions: {
                    themeVariables: {
                        '--wcm-font-family':
                            "'Suisse International', sans-serif",
                        '--wcm-accent-color': '#002133',
                        '--wcm-background-color': '#5162FF',
                    },
                },
            },
        }),
        new InjectedConnector({
            chains,
            options: {
                name: 'Injected',
                shimDisconnect: true,
            },
        }),
    ],
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

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <CookiesProvider>
            <QueryClientProvider client={queryClient}>
                <WagmiConfig config={config}>{children}</WagmiConfig>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </CookiesProvider>
    );
};

export default App;
