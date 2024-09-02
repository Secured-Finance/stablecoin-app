import { CurrencySymbol } from '../currencyList';
import { Currency } from './currency';

export class WBTC extends Currency {
    private constructor() {
        super(8, CurrencySymbol.WBTC, 'Bitcoin');
    }

    private static instance: WBTC;

    public static onChain(): WBTC {
        this.instance = this.instance || new WBTC();
        return this.instance;
    }
}
