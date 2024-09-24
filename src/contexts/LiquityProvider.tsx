import { Provider } from '@ethersproject/abstract-provider';
import { Web3Provider } from '@ethersproject/providers';
import {
    BlockPolledLiquityStore,
    EthersLiquity,
    EthersLiquityWithStore,
    _connectByChainId,
} from '@liquity/lib-ethers';
import { createContext, useEffect, useMemo, useState } from 'react';
import { LiquityFrontendConfig, getConfig } from 'src/config';
import { useAccount, useChainId, useClient, useWalletClient } from 'wagmi';
import { BatchedProvider } from './BatchingProvider';

type LiquityContextValue = {
    config: LiquityFrontendConfig;
    account: string;
    provider: Provider;
    liquity: EthersLiquityWithStore<BlockPolledLiquityStore>;
};

export const LiquityContext = createContext<LiquityContextValue | undefined>(
    undefined
);

// type LiquityProviderProps = React.PropsWithChildren<{
//     loader?: React.ReactNode;
//     unsupportedNetworkFallback?: React.ReactNode;
//     unsupportedMainnetFallback?: React.ReactNode;
// }>;

export const LiquityProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const chainId = useChainId();
    const client = useClient();

    const provider =
        client &&
        new Web3Provider(
            (method, params) =>
                client.request({
                    method: method as any,
                    params: params as any,
                }),
            chainId
        );

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

    const [config, setConfig] = useState<LiquityFrontendConfig>();
    console.log('config', config);

    const connection = useMemo(() => {
        if (config && provider && signer && account.address) {
            const batchedProvider = new BatchedProvider(provider, chainId);
            // batchedProvider._debugLog = true;

            try {
                return _connectByChainId(batchedProvider, signer, chainId, {
                    userAddress: account.address,
                    frontendTag: config.frontendTag,
                    useStore: 'blockPolled',
                });
            } catch (err) {
                console.error(err);
            }
        }
    }, [config, provider, signer, account.address, chainId]);

    useEffect(() => {
        getConfig().then(setConfig);
    }, []);

    if (!config || !provider || !signer || !account.address) {
        return <>{'arpit'}</>;
    }

    if (!connection) {
        return <>{'arpit'}</>;
    }

    const liquity = EthersLiquity._from(connection);
    liquity.store.logging = true;

    return (
        <LiquityContext.Provider
            value={{
                config,
                account: account.address,
                provider: connection.provider,
                liquity,
            }}
        >
            {children}
        </LiquityContext.Provider>
    );
};
