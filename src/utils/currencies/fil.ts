import { BaseCurrency } from './baseCurrency';
import { NativeCurrency } from './nativeCurrency';

export class FIL extends NativeCurrency {
    private constructor() {
        super(18, 'FIL', 'Filecoin');
    }

    private static instance: FIL;

    public static onChain(): FIL {
        return this.instance ?? (this.instance = new FIL());
    }

    public readonly wrapped = this;

    public equals(other: BaseCurrency): boolean {
        return other.isNative && other.symbol === this.symbol;
    }
}
