import { useCallback, useRef } from 'react';
import { COIN } from 'src/strings';
import {
    ProviderRpcError,
    UnauthorizedProviderError,
    UserRejectedRequestError,
} from 'viem';
import { useWalletClient } from 'wagmi';

interface UseAddTokenParams {
    debtToken: string | undefined;
}

export function useAddToken({ debtToken }: UseAddTokenParams) {
    const ongoingCallsRef = useRef(new Map<string, Promise<boolean>>());
    const { data: walletClient } = useWalletClient();
    const isCallingRef = useRef(false);

    const addToken = useCallback(async () => {
        if (!walletClient || !debtToken) return;

        // Prevent concurrent calls
        if (isCallingRef.current) return;

        // Check if there's already an ongoing call for this token
        const callKey = `${walletClient.account.address}_${debtToken}`;
        if (ongoingCallsRef.current.has(callKey)) {
            return ongoingCallsRef.current.get(callKey);
        }

        isCallingRef.current = true;

        try {
            const callPromise = walletClient.watchAsset({
                type: 'ERC20',
                options: {
                    address: debtToken,
                    symbol: COIN,
                    decimals: 18,
                    image: 'https://app.usdfc.net/apple-touch-icon.png',
                },
            });

            // Store the promise to prevent duplicate calls
            ongoingCallsRef.current.set(callKey, callPromise);

            const success = await callPromise;

            return success;
        } catch (e: unknown) {
            ongoingCallsRef.current.delete(callKey);

            // Type guard for ProviderRpcError
            if (typeof e === 'object' && e !== null && 'code' in e) {
                const error = e as ProviderRpcError;

                // User rejected the request - retry
                if (error.code === UserRejectedRequestError.code) {
                    await addToken();
                }

                // Provider is unauthorized (wallet locked) - wait and return
                if (error.code === UnauthorizedProviderError.code) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    return;
                }
            }
        } finally {
            isCallingRef.current = false;
            ongoingCallsRef.current.delete(callKey);
        }
    }, [walletClient, debtToken]);

    return { addToken };
}
