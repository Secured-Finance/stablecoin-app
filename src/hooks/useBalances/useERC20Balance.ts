import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTokens } from 'src/hooks';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { ZERO_BI, currencyMap } from 'src/utils';

export const useERC20Balance = (address: string | undefined) => {
    const securedFinance = useSF();
    const tokenCurrencies = useTokens();

    const tokens = useMemo(() => {
        return (
            tokenCurrencies
                .filter(ccy => currencyMap[ccy].toCurrency().isToken)
                ?.map(ccy => currencyMap[ccy]) ?? []
        );
    }, [tokenCurrencies]);

    return useQueries({
        queries: tokens.map(token => {
            return {
                queryKey: [QueryKeys.TOKEN_BALANCE, token.symbol, address],
                queryFn: async () => {
                    // const balance = await securedFinance?.getERC20Balance(
                    //     token.toCurrency() as Token,
                    //     address ?? ''
                    // );

                    // TODO: Get token balance from SDK
                    return ZERO_BI;
                },
                select: (balance: bigint) => {
                    return [token.symbol, balance];
                },
                enabled: !!securedFinance && !!address && tokens.length > 0,
            };
        }),
    });
};
