import { useCallback } from 'react';
import { COIN } from 'src/strings';
import { useWalletClient } from 'wagmi';

interface UseAddTokenParams {
    debtToken: string | undefined;
}

export function useAddToken({ debtToken }: UseAddTokenParams) {
    const { data: walletClient } = useWalletClient();
    const addToken = useCallback(async () => {
        if (!walletClient || !debtToken) return;

        const success = await walletClient.watchAsset({
            type: 'ERC20',
            options: {
                address: debtToken,
                symbol: COIN,
                decimals: 18,
                image: 'https://app.usdfc.net/apple-touch-icon.png',
            },
        });

        if (success) {
            localStorage.setItem(`token_${debtToken}`, 'true');
            return true;
        }
        return false;
    }, [walletClient, debtToken]);

    return { addToken };
}
