import { Currency } from './currency';

export class FIL extends Currency {
    private constructor() {
        super(18, 'FIL', 'Filecoin');
    }

    private static instance: FIL;

    public static onChain(): FIL {
        return this.instance ?? (this.instance = new FIL());
    }
}
