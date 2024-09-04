import { Currency } from './currency';

export class AXLFIL extends Currency {
    private constructor() {
        super(18, 'axlFIL', 'Axelar Wrapped FIL');
    }

    private static instance: AXLFIL;

    public static onChain(): AXLFIL {
        this.instance = this.instance || new AXLFIL();
        return this.instance;
    }
}
