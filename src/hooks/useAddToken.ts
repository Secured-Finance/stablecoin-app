import { useCallback, useRef } from 'react';
import { COIN } from 'src/strings';
import { useWalletClient } from 'wagmi';

interface UseAddTokenParams {
    debtToken: string | undefined;
}

// Global map to track ongoing watchAsset calls
const ongoingCalls = new Map<string, Promise<boolean>>();

export function useAddToken({ debtToken }: UseAddTokenParams) {
    const { data: walletClient } = useWalletClient();
    const isCallingRef = useRef(false);

    const addToken = useCallback(async () => {
        if (!walletClient || !debtToken) return;

        // Prevent concurrent calls
        if (isCallingRef.current) return;

        // Check if there's already an ongoing call for this token
        const callKey = `${walletClient.account.address}_${debtToken}`;
        if (ongoingCalls.has(callKey)) {
            return ongoingCalls.get(callKey);
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
            ongoingCalls.set(callKey, callPromise);

            const success = await callPromise;

            return success;
        } finally {
            isCallingRef.current = false;
            ongoingCalls.delete(callKey);
        }
    }, [walletClient, debtToken]);

    return { addToken };
}
