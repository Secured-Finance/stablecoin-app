import { Currency } from './currency';

export class USDC extends Currency {
    private constructor() {
        super(6, 'USDC', 'USDC');
    }

    private static instance: USDC;

    public static onChain(): USDC {
        this.instance = this.instance || new USDC();
        return this.instance;
    }
}
