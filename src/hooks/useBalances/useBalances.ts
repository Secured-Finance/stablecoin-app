import { useMemo } from 'react';
import { useERC20Balance, useTokens } from 'src/hooks';
import {
    CurrencySymbol,
    ZERO_BI,
    createCurrencyMap,
    currencyMap,
} from 'src/utils';
import { useAccount, useBalance } from 'wagmi';

const zeroBalances = createCurrencyMap<bigint>(ZERO_BI);

export const useBalances = () => {
    const balances: Record<CurrencySymbol, bigint> = {
        ...zeroBalances,
    };

    const { address } = useAccount();
    const { data: balance } = useBalance({
        address,
    });

    const tokens = useTokens();

    const nativeCurrency = useMemo(() => {
        const targetCurrency = tokens.find(
            currency => currencyMap[currency].toCurrency().isNative
        );
        return targetCurrency ? currencyMap[targetCurrency] : undefined;
    }, [tokens]);

    if (nativeCurrency) {
        balances[nativeCurrency.symbol] = balance?.value ?? ZERO_BI;
    }

    const balanceQueriesResults = useERC20Balance(address);

    balanceQueriesResults.forEach(value => {
        if (value.data) {
            balances[value.data[0] as CurrencySymbol] = value.data[1] as bigint;
        }
    });

    return balances;
};
