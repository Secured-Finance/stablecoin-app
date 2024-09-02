import { CurrencySymbol } from '../currencyList';
import { Currency } from './currency';

export class BTCB extends Currency {
    private constructor() {
        super(8, CurrencySymbol.BTCb, 'Bitcoin');
    }

    private static instance: BTCB;

    public static onChain(): BTCB {
        this.instance = this.instance || new BTCB();
        return this.instance;
    }
}
