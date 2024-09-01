import { createContext, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateChainError,
    updateChainId,
    updateIsChainIdDetected,
    updateLatestBlock,
} from 'src/store/blockchain';
import { RootState } from 'src/store/types';
import { getSupportedChainIds } from 'src/utils';
import { hexToNumber } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

export const CACHED_PROVIDER_KEY = 'CACHED_PROVIDER_KEY';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ethereum?: any;
    }
}

export interface SFContext {
    satoshiClient?: string;
}

export const Context = createContext<SFContext>({
    satoshiClient: undefined,
});

const SecuredFinanceProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const dispatch = useDispatch();
    const { chain } = useAccount();
    // const protocolConfig = ProtocolConfigMap.BEVM_MAINNET;
    const chainId = useSelector((state: RootState) => state.blockchain.chainId);
    const publicClient = usePublicClient({
        chainId: chainId,
    });

    // const queryClient = useQueryClient();
    // const client = useWalletClient();

    // const [satoshiClient, setSatoshiClient] = useState<SatoshiClient>();

    const dispatchChainError = useCallback(
        (chainId: number) => {
            dispatch(
                updateChainError(!getSupportedChainIds().includes(chainId))
            );
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

    // useEffect(() => {
    //     const connectSatoshiClient = (walletClient: WalletClient) => {
    //         const satoshiClient = new SatoshiClient(
    //             protocolConfig,
    //             walletClient as unknown as WalletClient
    //         );

    //         setSatoshiClient(previous => {
    //             if (!previous) {
    //                 return satoshiClient;
    //             }

    //             if (isConnected) {
    //                 return satoshiClient;
    //             }

    //             return previous;
    //         });
    //     };

    //     if (isConnected && client?.chain && client?.transport) {
    //         connectSatoshiClient(client);
    //     }
    // }, [client?.transport, client, isConnected, protocolConfig]);

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
        <Context.Provider value={{ satoshiClient: 'arpit' }}>
            {children}
        </Context.Provider>
    );
};

export default SecuredFinanceProvider;
