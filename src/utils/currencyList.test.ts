import {
    filBytes32,
    ifilBytes32,
    tfilBytes32,
} from 'src/stories/mocks/fixtures';
import {
    CurrencySymbol,
    amountFormatterFromBase,
    amountFormatterToBase,
    currencyMap,
    divide,
    hexToCurrencySymbol,
    multiply,
    toCurrency,
    toCurrencySymbol,
} from './currencyList';

const fil = currencyMap.FIL;
const tfil = currencyMap.tFIL;

describe('currencyList toBaseUnit', () => {
    it('should return the value in wei for fil', () => {
        expect(fil.toBaseUnit(1).toString()).toEqual('1000000000000000000');
        expect(fil.toBaseUnit(1.23).toString()).toEqual('1230000000000000000');
        expect(fil.toBaseUnit(1.23456789).toString()).toEqual(
            '1234567890000000000'
        );
        expect(fil.toBaseUnit(9999999).toString()).toEqual(
            '9999999000000000000000000'
        );
        expect(fil.toBaseUnit(0.00000001).toString()).toEqual('10000000000');
        expect(fil.toBaseUnit(0.000000000001).toString()).toEqual('1000000');
        expect(fil.toBaseUnit(0.000000000000000001).toString()).toEqual('1');
    });

    it('should return the value in attoFil for FIL', () => {
        expect(tfil.toBaseUnit(1).toString()).toEqual('1000000000000000000');
        expect(tfil.toBaseUnit(1.23).toString()).toEqual('1230000000000000000');
        expect(tfil.toBaseUnit(1.23456789).toString()).toEqual(
            '1234567890000000000'
        );
        expect(tfil.toBaseUnit(0.00000001).toString()).toEqual('10000000000');
        expect(tfil.toBaseUnit(0.000000000001).toString()).toEqual('1000000');
        expect(tfil.toBaseUnit(0.000000000000000001).toString()).toEqual('1');
    });

    it('should return 0 if the input value is inferior to the base blockchain unit', () => {
        expect(tfil.toBaseUnit(0.0000000000000000001).toString()).toEqual('0');
        expect(tfil.toBaseUnit(0.0000000000000000009).toString()).toEqual('0');
        expect(tfil.toBaseUnit(0.000000000000000000001).toString()).toEqual(
            '0'
        );
        expect(fil.toBaseUnit(0.0000000000000000001).toString()).toEqual('0');
        expect(fil.toBaseUnit(0.000000000000000000001).toString()).toEqual('0');
    });
});

describe('currencyList fromBaseUnit', () => {
    it('should return the value in fil for wei amount', () => {
        expect(
            fil.fromBaseUnit(BigInt('1000000000000000000')).toString()
        ).toEqual('1');
        expect(
            fil.fromBaseUnit(BigInt('1230000000000000000')).toString()
        ).toEqual('1.23');
        expect(
            fil.fromBaseUnit(BigInt('1234567890000000000')).toString()
        ).toEqual('1.23456789');
        expect(
            fil.fromBaseUnit(BigInt('9999999000000000000000000')).toString()
        ).toEqual('9999999');
        expect(fil.fromBaseUnit(BigInt('10000000000')).toString()).toEqual(
            '1e-8'
        );
        expect(fil.fromBaseUnit(BigInt('1000000')).toString()).toEqual('1e-12');
    });

    it('should return the value in FIL for attoFil amount', () => {
        expect(
            tfil.fromBaseUnit(BigInt('1000000000000000000')).toString()
        ).toEqual('1');
        expect(
            tfil.fromBaseUnit(BigInt('1230000000000000000')).toString()
        ).toEqual('1.23');
        expect(
            tfil.fromBaseUnit(BigInt('1234567890000000000')).toString()
        ).toEqual('1.23456789');
        expect(tfil.fromBaseUnit(BigInt('10000000000')).toString()).toEqual(
            '1e-8'
        );
        expect(tfil.fromBaseUnit(BigInt('1000000')).toString()).toEqual(
            '1e-12'
        );
    });
});

describe('toCurrency', () => {
    it('should convert currency symbol to Currency object', () => {
        expect(toCurrency(CurrencySymbol.FIL)).toEqual(
            currencyMap.FIL.toCurrency()
        );
        expect(toCurrency(CurrencySymbol.iFIL)).toEqual(
            currencyMap.iFIL.toCurrency()
        );
        expect(toCurrency(CurrencySymbol.tFIL)).toEqual(
            currencyMap.tFIL.toCurrency()
        );
    });
});

describe('currencyList amountFormatterToBase', () => {
    it('should return the value in wei for fil', () => {
        const format = amountFormatterToBase[CurrencySymbol.FIL];
        expect(format(1).toString()).toEqual('1000000000000000000');
        expect(format(1.23).toString()).toEqual('1230000000000000000');
        expect(format(1.23456789).toString()).toEqual('1234567890000000000');
        expect(format(0.00000001).toString()).toEqual('10000000000');
        expect(format(0.000000000001).toString()).toEqual('1000000');
        expect(format(0.000000000000000001).toString()).toEqual('1');
    });

    it('should return the value in attoFil for FIL', () => {
        const format = amountFormatterToBase[CurrencySymbol.FIL];
        expect(format(1).toString()).toEqual('1000000000000000000');
        expect(format(1.23).toString()).toEqual('1230000000000000000');
        expect(format(1.23456789).toString()).toEqual('1234567890000000000');
        expect(format(0.00000001).toString()).toEqual('10000000000');
        expect(format(0.000000000001).toString()).toEqual('1000000');
        expect(format(0.000000000000000001).toString()).toEqual('1');
    });

    it('should return 0 if the input value is inferior to the base blockchain unit', () => {
        const format = amountFormatterToBase[CurrencySymbol.FIL];
        expect(format(0.0000000000000000001).toString()).toEqual('0');
        expect(format(0.0000000000000000009).toString()).toEqual('0');
        expect(format(0.000000000000000000001).toString()).toEqual('0');
        expect(format(0.0000000000000000001).toString()).toEqual('0');
        expect(format(0.000000000000000000001).toString()).toEqual('0');
    });
});

describe('currencyList amountFormatterFromBase', () => {
    it('should return the value in fil for wei amount', () => {
        const format = amountFormatterFromBase[CurrencySymbol.FIL];
        expect(format(BigInt('1000000000000000000000000')).toString()).toEqual(
            '1000000'
        );
        expect(format(BigInt('1000000000000000000')).toString()).toEqual('1');
        expect(format(BigInt('1230000000000000000')).toString()).toEqual(
            '1.23'
        );
        expect(format(BigInt('1234567890000000000')).toString()).toEqual(
            '1.23456789'
        );
        expect(format(BigInt('10000000000')).toString()).toEqual('1e-8');
        expect(format(BigInt('1000000')).toString()).toEqual('1e-12');
    });

    it('should return the value in FIL for attoFil amount', () => {
        const format = amountFormatterFromBase[CurrencySymbol.FIL];
        expect(format(BigInt('1000000000000000000')).toString()).toEqual('1');
        expect(format(BigInt('1230000000000000000')).toString()).toEqual(
            '1.23'
        );
        expect(format(BigInt('1234567890000000000')).toString()).toEqual(
            '1.23456789'
        );
        expect(format(BigInt('10000000000')).toString()).toEqual('1e-8');
        expect(format(BigInt('1000000')).toString()).toEqual('1e-12');
    });
});

describe('toCurrencySymbol', () => {
    it('should convert a currency string to a currency symbol', () => {
        expect(toCurrencySymbol('FIL')).toEqual(CurrencySymbol.FIL);
        expect(toCurrencySymbol('iFIL')).toEqual(CurrencySymbol.iFIL);
        expect(toCurrencySymbol('tFIL')).toEqual(CurrencySymbol.tFIL);
    });

    it('should return undefined if the currency is not supported', () => {
        expect(toCurrencySymbol('')).toBeUndefined();
        expect(toCurrencySymbol('XRP')).toBeUndefined();
        expect(toCurrencySymbol('EUR')).toBeUndefined();
    });
});

describe('hexToCurrencySymbol', () => {
    it('should convert a hex string to a currency symbol', () => {
        expect(hexToCurrencySymbol(filBytes32)).toEqual(CurrencySymbol.FIL);
        expect(hexToCurrencySymbol(ifilBytes32)).toEqual(CurrencySymbol.iFIL);
        expect(hexToCurrencySymbol(tfilBytes32)).toEqual(CurrencySymbol.tFIL);
    });

    it('should return undefined if the currency is not supported', () => {
        expect(hexToCurrencySymbol('0x585250')).toBeUndefined();
        expect(hexToCurrencySymbol('0x455552')).toBeUndefined();
    });
});

describe('multiply', () => {
    it('should multiply two numbers with precision', () => {
        expect(multiply(80.6, 100)).toEqual(8060);
        expect(multiply(80.612, 99.12345, 4)).toEqual(7990.5396);
    });

    it('should multiply two bigints with precision', () => {
        expect(multiply(BigInt(806), BigInt(100))).toEqual(80600);
        expect(multiply(BigInt(8012), BigInt(9912), 4)).toEqual(79414944);
    });

    it('should multiply bigint and a number with precision', () => {
        expect(multiply(80.6, BigInt(100))).toEqual(8060);
        expect(multiply(8012, BigInt(9912), 4)).toEqual(79414944);
    });
});

describe('divide', () => {
    it('should divide two numbers with precision', () => {
        expect(divide(8060, 100)).toEqual(80.6);
        expect(divide(80.612, 99.12345, 4)).toEqual(0.8132);
    });

    it('should divide two bigints with precision', () => {
        expect(divide(BigInt(8060), BigInt(100))).toEqual(80.6);
        expect(divide(BigInt(80612), BigInt(99123), 4)).toEqual(0.8133);
    });

    it('should divide bigint and a number with precision', () => {
        expect(divide(8060, BigInt(100))).toEqual(80.6);
        expect(divide(BigInt(80612), 99123, 4)).toEqual(0.8133);
    });
});
