import { currencyMap, CurrencySymbol, toCurrencySymbol } from 'src/utils';
import useSF from '../useSecuredFinance';

export const useTokens = () => {
    const securedFinance = useSF();

    if (!securedFinance) {
        return [];
    }

    const tokens = securedFinance.protocolConfig.TOKEN_LIST.map(
        token => token.symbol
    );

    return tokens
        .map(toCurrencySymbol)
        .filter((ccy): ccy is CurrencySymbol => ccy !== undefined)
        .sort((a, b) => currencyMap[a].index - currencyMap[b].index);
};
