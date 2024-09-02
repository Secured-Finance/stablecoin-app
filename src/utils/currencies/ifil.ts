import { Currency } from './currency';

export class IFIL extends Currency {
    private constructor() {
        super(18, 'iFIL', 'Infinity Pool Staked FIL');
    }

    private static instance: IFIL;

    public static onChain(): IFIL {
        this.instance = this.instance || new IFIL();
        return this.instance;
    }
}
