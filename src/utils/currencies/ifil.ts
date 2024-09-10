import { Token } from './token';

export class IFIL extends Token {
    private constructor() {
        super(18, 'iFIL', 'Infinity Pool Staked FIL');
    }

    private static instance: IFIL;

    public static onChain(): IFIL {
        this.instance = this.instance || new IFIL();
        return this.instance;
    }
}
