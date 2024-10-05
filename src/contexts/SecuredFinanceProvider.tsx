import { createContext, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProtocolConfigMap, SatoshiClient } from 'satoshi-sdk';
import {
    updateChainId,
    updateIsChainIdDetected,
    updateLatestBlock,
} from 'src/store/blockchain';
import { RootState } from 'src/store/types';
import { hexToNumber, WalletClient } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

export const CACHED_PROVIDER_KEY = 'CACHED_PROVIDER_KEY';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ethereum?: any;
    }
}

export interface SFContext {
    satoshiClient?: SatoshiClient;
}

export const Context = createContext<SFContext>({
    satoshiClient: undefined,
});

export const SecuredFinanceProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const dispatch = useDispatch();
    const { chain, isConnected } = useAccount();
    const protocolConfig = ProtocolConfigMap.BEVM_MAINNET;
    const chainId = useSelector((state: RootState) => state.blockchain.chainId);
    const publicClient = usePublicClient({
        chainId: chainId,
    });

    const { data: client } = useWalletClient();

    const [satoshiClient, setSatoshiClient] = useState<SatoshiClient>();

    const dispatchChainError = useCallback(
        (chainId: number) => {
            dispatch(updateChainId(chainId));
        },
        [dispatch]
    );

    const handleChainChanged = useCallback(
        (chainId: string) => {
            dispatchChainError(hexToNumber(chainId as `0x${string}`));
        },
        [dispatchChainError]
    );

    useEffect(() => {
        // this is required to get the chainId on initial page load
        const fetchChainId = async () => {
            if (window.ethereum) {
                const chainId = await window.ethereum.request({
                    method: 'eth_chainId',
                });
                dispatch(updateIsChainIdDetected(true));
                dispatchChainError(hexToNumber(chainId));
            }
        };
        fetchChainId();
        window.ethereum?.on('chainChanged', handleChainChanged);
        return () => {
            window.ethereum?.removeListener('chainChanged', handleChainChanged);
        };
    }, [dispatchChainError, handleChainChanged, dispatch]);

    useEffect(() => {
        if (chain) {
            dispatchChainError(chain.id);
        }
    }, [chain, dispatchChainError]);

    useEffect(() => {
        const connectSatoshiClient = (walletClient: WalletClient) => {
            const satoshiClient = new SatoshiClient(
                protocolConfig,
                walletClient
            );

            setSatoshiClient(previous => {
                if (!previous) {
                    return satoshiClient;
                }

                if (isConnected) {
                    return satoshiClient;
                }

                return previous;
            });
        };

        if (isConnected && client?.chain && client?.transport) {
            connectSatoshiClient(client);
        }
    }, [client?.transport, client, isConnected, protocolConfig]);

    useEffect(() => {
        if (!publicClient) return;

        const unwatch = publicClient.watchBlockNumber({
            onBlockNumber: blockNumber => {
                if (blockNumber && typeof blockNumber === 'bigint') {
                    dispatch(updateLatestBlock(Number(blockNumber)));
                    // Invalidate all queries
                }
            },
        });

        return () => {
            unwatch();
        };
    }, [dispatch, handleChainChanged, publicClient]);

    return (
        <Context.Provider value={{ satoshiClient }}>
            {children}
        </Context.Provider>
    );
};
