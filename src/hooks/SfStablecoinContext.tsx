/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from '@ethersproject/abstract-provider';
import { Web3Provider } from '@ethersproject/providers';
import {
    BlockPolledSfStablecoinStore,
    EthersSfStablecoin,
    EthersSfStablecoinWithStore,
    _connectByChainId,
} from '@secured-finance/stablecoin-lib-ethers';
import { ethers } from 'ethers';
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { FrontendConfig, getConfig } from 'src/configs';
import { rpcUrls } from 'src/constants';
import { BatchedProvider } from 'src/contexts';
import { useAccount, useChainId, useClient, useWalletClient } from 'wagmi';

type ContextValue = {
    config: FrontendConfig;
    account: string;
    provider: Provider;
    sfStablecoin: EthersSfStablecoinWithStore<BlockPolledSfStablecoinStore>;
};

const SfStablecoinContext = createContext<ContextValue | undefined>(undefined);

type SfStablecoinProviderProps = React.PropsWithChildren<{
    loader?: React.ReactNode;
    unsupportedNetworkFallback?: React.ReactNode;
    unsupportedMainnetFallback?: React.ReactNode;
}>;

export const SfStablecoinProvider: React.FC<SfStablecoinProviderProps> = ({
    children,
    loader,
    unsupportedNetworkFallback,
    unsupportedMainnetFallback,
}) => {
    const chainId = useChainId();
    const client = useClient();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const provider = useMemo(() => {
        if (client) {
            return new Web3Provider(
                (method, params) =>
                    client.request({
                        method: method as any,
                        params: params as any,
                    }),
                chainId
            );
        } else {
            // Default RPC if no wallet
            const rpcUrl =
                chainId === 314
                    ? rpcUrls.filecoin
                    : rpcUrls.filecoinCalibration;

            return new ethers.providers.JsonRpcProvider(rpcUrl, chainId);
        }
    }, [client, chainId]);

    const account = useAccount();
    const walletClient = useWalletClient();

    const signer =
        account.address &&
        walletClient.data &&
        new Web3Provider(
            (method, params) =>
                walletClient.data.request({
                    method: method as any,
                    params: params as any,
                }),
            chainId
        ).getSigner(account.address);

    const [config, setConfig] = useState<FrontendConfig>();

    const connection = useMemo(() => {
        if (!config || !provider) return null;
        const batchedProvider = new BatchedProvider(provider, chainId);
        // batchedProvider._debugLog = true;
        batchedProvider.pollingInterval = 12_000;

        try {
            if (signer && account.address) {
                return _connectByChainId(batchedProvider, signer, chainId, {
                    userAddress: account.address,
                    frontendTag: config.frontendTag,
                    useStore: 'blockPolled',
                });
            } else {
                return _connectByChainId(batchedProvider, undefined, chainId, {
                    userAddress: '0x0000000000000000000000000000000000000000',
                    frontendTag: config.frontendTag,
                    useStore: 'blockPolled',
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [config, provider, signer, account.address, chainId]);

    useEffect(() => {
        getConfig().then(setConfig);
    }, []);

    if (!config || !provider) {
        return <>{loader}</>;
    }

    if (config.testnetOnly && chainId === 314) {
        return <>{unsupportedMainnetFallback}</>;
    }

    if (!connection) {
        return <>{unsupportedNetworkFallback}</>;
    }

    const sfStablecoin = EthersSfStablecoin._from(connection);
    sfStablecoin.store.logging = true;

    return (
        <SfStablecoinContext.Provider
            value={{
                config,
                account: account.address || '',
                provider: connection.provider,
                sfStablecoin,
            }}
        >
            {children}
        </SfStablecoinContext.Provider>
    );
};

export const useSfStablecoin = () => {
    const context = useContext(SfStablecoinContext);

    if (!context) {
        throw new Error('You must provide a Context via SfStablecoinProvider');
    }

    return context;
};
