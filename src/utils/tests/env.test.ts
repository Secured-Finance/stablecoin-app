import {
    Environment,
    getAmplitudeApiKey,
    getEnvironment,
    getGoogleAnalyticsTag,
    getSetPriceEnabled,
    getWalletConnectId,
} from 'src/utils';

describe('getWalletConnectId', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_WALLET_CONNECT_ID = 'test';
        const walletConnectId = getWalletConnectId();
        expect(walletConnectId).toBe('test');
        expect(typeof walletConnectId).toBe('string');
    });

    it('should throw error if variable is not set', () => {
        process.env.NEXT_PUBLIC_WALLET_CONNECT_ID = '';
        expect(() => getWalletConnectId()).toThrowError(
            'NEXT_PUBLIC_WALLET_CONNECT_ID is not set'
        );
    });
});

describe('getAmplitudeApiKey', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY = 'test';
        const apiKey = getAmplitudeApiKey();
        expect(apiKey).toBe('test');
        expect(typeof apiKey).toBe('string');
    });

    it('should return empty string if variable is not set', () => {
        process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY = '';
        const spy = jest.spyOn(console, 'warn').mockImplementation();

        const apiKey = getAmplitudeApiKey();
        expect(apiKey).toBe('');
        expect(typeof apiKey).toBe('string');
        expect(spy).toHaveBeenCalled();
    });
});

describe('getGoogleAnalyticsTag', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG = 'test';
        const apiKey = getGoogleAnalyticsTag();
        expect(apiKey).toBe('test');
        expect(typeof apiKey).toBe('string');
    });

    it('should return empty string if variable is not set', () => {
        process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG = '';
        const spy = jest.spyOn(console, 'warn').mockImplementation();

        const apiKey = getGoogleAnalyticsTag();
        expect(apiKey).toBe('');
        expect(typeof apiKey).toBe('string');
        expect(spy).toHaveBeenCalled();
    });
});

describe('getEnvironment', () => {
    it('should return the value of the environment variable', () => {
        process.env.SF_ENV = 'testnet';
        const env = getEnvironment();
        expect(env).toBe('testnet');
        expect(typeof env).toBe('string');
    });

    it('should return development if variable is not set', () => {
        process.env.SF_ENV = '';
        const spy = jest.spyOn(console, 'warn').mockImplementation();

        const env = getEnvironment();
        expect(env).toBe(Environment.DEVELOPMENT);
        expect(typeof env).toBe('string');
        expect(spy).toHaveBeenCalled();
    });
});

describe('getSetPriceEnabled ', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_SET_PRICE_ENABLED = 'true';
        const useCommitHash = getSetPriceEnabled();
        expect(useCommitHash).toBe(true);
        expect(typeof useCommitHash).toBe('boolean');
    });

    it('should return false if variable is not set', () => {
        process.env.NEXT_PUBLIC_SET_PRICE_ENABLED = '';
        const useCommitHash = getSetPriceEnabled();
        expect(useCommitHash).toBe(false);
        expect(typeof useCommitHash).toBe('boolean');
    });
});
