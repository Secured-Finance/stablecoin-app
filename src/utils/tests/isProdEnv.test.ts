import { Environment, isProdEnv } from 'src/utils';

describe('isProdEnv function', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should return true if environment is production', () => {
        process.env.SF_ENV = Environment.PRODUCTION;
        expect(isProdEnv()).toBe(true);
    });

    it('should return false if environment is not production', () => {
        process.env.SF_ENV = Environment.STAGING;
        expect(isProdEnv()).toBe(false);
    });
});
