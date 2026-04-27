import { useCallback } from 'react';
import { COIN } from 'src/strings';
import { useWalletClient } from 'wagmi';

interface UseAddTokenParams {
    debtToken: string | undefined;
    address: string | undefined;
}

export function useAddToken({ debtToken, address }: UseAddTokenParams) {
    const { data: walletClient } = useWalletClient();
    const addToken = useCallback(async () => {
        if (!walletClient || !debtToken || !address) return;

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
            localStorage.setItem(`token_${address}_${debtToken}`, 'true');
            return true;
        }
        return false;
    }, [walletClient, debtToken, address]);

    return { addToken };
}
