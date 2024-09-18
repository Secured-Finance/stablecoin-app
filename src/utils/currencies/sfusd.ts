import { Token } from './token';

export class SFUSD extends Token {
    private constructor() {
        super(18, 'SFUSD', 'SF Stable Coin');
    }

    private static instance: SFUSD;

    public static onChain(): SFUSD {
        this.instance = this.instance || new SFUSD();
        return this.instance;
    }
}
