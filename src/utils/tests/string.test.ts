import {
    Environment,
    fromBytes32,
    getEnvShort,
    prefixTilde,
    toBytes32,
} from 'src/utils';

describe('getEnvShort', () => {
    it('should return the correct environment in short', () => {
        process.env.SF_ENV = Environment.DEVELOPMENT;
        expect(getEnvShort()).toEqual('dev');
        process.env.SF_ENV = Environment.STAGING;
        expect(getEnvShort()).toEqual('stg');
        process.env.SF_ENV = Environment.PRODUCTION;
        expect(getEnvShort()).toEqual('prod');
        process.env.SF_ENV = 'random';
        expect(getEnvShort()).toEqual('');
    });
});

describe('prefixTilde', () => {
    it('should return the value prefixed with ~ sign', () => {
        expect(prefixTilde('test')).toEqual('~ test');
        expect(prefixTilde('')).toEqual('');
    });
});

describe('test string format functions', function () {
    it('toBytes32', async () => {
        const text = 'Hello World!';
        const expectedHex =
            '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000';

        const result = toBytes32(text);
        expect(result).toEqual(expectedHex);
    });

    it('fromBytes32', async () => {
        const hex =
            '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000';
        const expectedText = 'Hello World!';

        const result = fromBytes32(hex);
        expect(result).toEqual(expectedText);
    });
});
