import { useCallback, useRef } from 'react';
import { COIN } from 'src/strings';
import { UnauthorizedProviderError, UserRejectedRequestError } from 'viem';
import { useWalletClient } from 'wagmi';

interface UseAddTokenParams {
    debtToken: string | undefined;
}

export function useAddToken({ debtToken }: UseAddTokenParams) {
    const ongoingCallsRef = useRef(new Map<string, Promise<boolean>>());
    const { data: walletClient } = useWalletClient();

    const addToken = useCallback(async () => {
        if (!walletClient || !debtToken) return;

        // Check if there's already an ongoing call for this token
        const callKey = `${walletClient.account.address}_${debtToken}`;
        if (ongoingCallsRef.current.has(callKey)) {
            return ongoingCallsRef.current.get(callKey);
        }

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
            // User rejected the request - return silently
            if (e instanceof UserRejectedRequestError) {
                return;
            }

            if (e instanceof UnauthorizedProviderError) {
                return;
            }

            // Log unexpected errors for debugging
            console.error('Unexpected error in addToken:', e);
        } finally {
            ongoingCallsRef.current.delete(callKey);
        }
    }, [walletClient, debtToken]);

    return { addToken };
}
