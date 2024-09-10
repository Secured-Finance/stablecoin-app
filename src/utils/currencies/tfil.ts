import { Currency } from './currency';

export class TFIL extends Currency {
    private constructor() {
        super(18, 'tFIL', 'Testnet Filecoin');
    }

    private static instance: TFIL;

    public static onChain(): TFIL {
        this.instance = this.instance || new TFIL();
        return this.instance;
    }
}
