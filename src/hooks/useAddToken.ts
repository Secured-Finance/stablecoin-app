import { useCallback } from 'react';
import { useWalletClient } from 'wagmi';

interface UseAddTokenParams {
    address: string | undefined;
    debtToken: string | undefined;
    coinSymbol: string;
}

export function useAddToken({
    address,
    debtToken,
    coinSymbol,
}: UseAddTokenParams) {
    const { data: walletClient } = useWalletClient();
    const addToken = useCallback(async () => {
        if (!walletClient || !address || !debtToken) return;

        const success = await walletClient.watchAsset({
            type: 'ERC20',
            options: {
                address: debtToken,
                symbol: coinSymbol,
                decimals: 18,
                image: 'https://app.usdfc.net/apple-touch-icon.png',
            },
        });

        if (success) {
            localStorage.setItem(`token_${debtToken}`, 'true');
            return true;
        }
        return false;
    }, [walletClient, address, debtToken, coinSymbol]);

    return { addToken };
}
