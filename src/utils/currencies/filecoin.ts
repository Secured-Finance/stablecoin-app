import { Currency } from './currency';

export class WFIL extends Currency {
    private constructor() {
        super(18, 'WFIL', 'Filecoin');
    }

    private static instance: WFIL;

    public static onChain(): WFIL {
        this.instance = this.instance || new WFIL();
        return this.instance;
    }
}
