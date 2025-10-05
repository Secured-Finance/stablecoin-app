import {
    Environment,
    getAmplitudeApiKey,
    getEnvironment,
    getFrontendTag,
    getGoogleAnalyticsTag,
    getSetPriceEnabled,
    getSquidWidgetIntegratorId,
    getWalletConnectId,
} from 'src/utils';

describe('getFrontendTag', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_FRONTEND_TAG =
            '0xDBA767F3DFF3835BEf5dE1eDEe91A9901402AB21';
        const frontendTag = getFrontendTag();
        expect(frontendTag).toBe('0xDBA767F3DFF3835BEf5dE1eDEe91A9901402AB21');
        expect(typeof frontendTag).toBe('string');
    });

    it('should throw error if variable is not set', () => {
        process.env.NEXT_PUBLIC_FRONTEND_TAG = '';
        expect(() => getFrontendTag()).toThrowError(
            'NEXT_PUBLIC_FRONTEND_TAG is not set'
        );
    });
});

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
    it('should return the default value of the environment variable', () => {
        process.env.SF_ENV = 'testnet';
        const spy = jest.spyOn(console, 'warn').mockImplementation();

        const env = getEnvironment();
        expect(env).toBe(Environment.DEVELOPMENT);
        expect(typeof env).toBe('string');
        expect(spy).toHaveBeenCalled();
    });

    it('should return the development if versions are specified', () => {
        process.env.SF_ENV = 'development-v1';
        let env = getEnvironment();
        expect(env).toBe(Environment.DEVELOPMENT);
        expect(typeof env).toBe('string');

        process.env.SF_ENV = 'development-v2';
        env = getEnvironment();
        expect(env).toBe(Environment.DEVELOPMENT);
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

describe('getSquidWidgetIntegratorId ', () => {
    it('should return the value of the environment variable', () => {
        process.env.NEXT_PUBLIC_SQUID_WIDGET_INTEGRATOR_ID = 'test';
        const useCommitHash = getSquidWidgetIntegratorId();
        expect(useCommitHash).toBe('test');
        expect(typeof useCommitHash).toBe('string');
    });

    it('should return empty string if variable is not set', () => {
        process.env.NEXT_PUBLIC_SQUID_WIDGET_INTEGRATOR_ID = '';
        const useCommitHash = getSquidWidgetIntegratorId();
        expect(useCommitHash).toBe('');
        expect(typeof useCommitHash).toBe('string');
    });
});
