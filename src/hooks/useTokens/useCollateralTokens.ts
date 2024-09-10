import { currencyMap, CurrencySymbol, toCurrencySymbol } from 'src/utils';
import useSF from '../useSecuredFinance';

export const useCollateralTokens = () => {
    const securedFinance = useSF();

    if (!securedFinance) {
        return [];
    }
    const tokens = securedFinance
        .getCollateralConfig()
        .map(token => token.NAME);

    return tokens
        .map(toCurrencySymbol)
        .filter((ccy): ccy is CurrencySymbol => ccy !== undefined)
        .sort((a, b) => currencyMap[a].index - currencyMap[b].index);
};
