import { BigNumber as BigNumberJS } from 'bignumber.js';
import FilIcon from 'src/assets/coins/fil.svg';
import IFilIcon from 'src/assets/coins/ifil.svg';
import SFUsdIcon from 'src/assets/coins/sfusd.svg';
import ZcFilIcon from 'src/assets/coins/zc-fil.svg';
import { SvgIcon } from 'src/types';
import { fromBytes32 } from 'src/utils';
import {
    Currency,
    Currency as CurrencyInterface,
    FIL,
    IFIL,
    SFUSD,
    TFIL,
} from 'src/utils/currencies';

BigNumberJS.set({ EXPONENTIAL_AT: 30 }); // setting to a decent limit

export const ZERO_BI = BigInt(0);

export enum CurrencySymbol {
    FIL = 'FIL',
    iFIL = 'iFIL',
    tFIL = 'tFIL',
    sfUSD = 'sfUSD',
}

export const currencyMap: Readonly<
    Record<CurrencySymbol, Readonly<CurrencyInfo>>
> = {
    [CurrencySymbol.FIL]: {
        index: 0,
        symbol: CurrencySymbol.FIL,
        name: 'Filecoin',
        icon: FilIcon,
        zcIcon: ZcFilIcon,
        coinGeckoId: 'filecoin',
        isCollateral: true,
        toBaseUnit: (amount: number | string) =>
            convertToBlockchainUnit(amount, FIL.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, FIL.onChain()),
        toCurrency: () => FIL.onChain(),
        roundingDecimal: 0,
        longName: 'Filecoin',
    },
    [CurrencySymbol.tFIL]: {
        index: 1,
        symbol: CurrencySymbol.tFIL,
        name: 'Filecoin',
        icon: FilIcon,
        zcIcon: ZcFilIcon,
        coinGeckoId: 'filecoin',
        isCollateral: true,
        toBaseUnit: (amount: number | string) =>
            convertToBlockchainUnit(amount, TFIL.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, TFIL.onChain()),
        toCurrency: () => TFIL.onChain(),
        roundingDecimal: 0,
        longName: 'Filecoin',
    },
    [CurrencySymbol.iFIL]: {
        index: 2,
        symbol: CurrencySymbol.iFIL,
        name: 'Infinity Pool Staked FIL',
        icon: IFilIcon,
        coinGeckoId: 'filecoin',
        isCollateral: true,
        toBaseUnit: (amount: number | string) =>
            convertToBlockchainUnit(amount, IFIL.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, IFIL.onChain()),
        toCurrency: () => IFIL.onChain(),
        roundingDecimal: 0,
        longName: 'Infinity Pool Staked FIL',
    },
    [CurrencySymbol.sfUSD]: {
        index: 3,
        symbol: CurrencySymbol.sfUSD,
        name: 'SF Stable Coin',
        icon: SFUsdIcon,
        coinGeckoId: '', // TODO
        isCollateral: false,
        toBaseUnit: (amount: number | string) =>
            convertToBlockchainUnit(amount, SFUSD.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, SFUSD.onChain()),
        toCurrency: () => SFUSD.onChain(),
        roundingDecimal: 4,
        longName: 'SF Stable Coin',
    },
};

const currencySymbolList = Object.keys(currencyMap) as CurrencySymbol[];
export const createCurrencyMap = <T,>(defaultValue: T) =>
    currencySymbolList.reduce((obj, ccy) => {
        obj[ccy] = defaultValue;
        return obj;
    }, {} as Record<CurrencySymbol, T>);

const getCurrencyMapAsList = () => {
    return Object.values(currencyMap).sort((a, b) => a.index - b.index);
};

export const amountFormatterToBase = getCurrencyMapAsList().reduce<
    Record<CurrencySymbol, (value: number | string) => bigint>
>(
    (acc, ccy) => ({
        ...acc,
        [ccy.symbol]: ccy.toBaseUnit,
    }),
    {} as Record<CurrencySymbol, (value: number | string) => bigint>
);

export const amountFormatterFromBase = getCurrencyMapAsList().reduce<
    Record<CurrencySymbol, (value: bigint) => number>
>(
    (acc, ccy) => ({
        ...acc,
        [ccy.symbol]: ccy.fromBaseUnit,
    }),
    {} as Record<CurrencySymbol, (value: bigint) => number>
);

export type CurrencyInfo = {
    index: number;
    symbol: CurrencySymbol;
    name: string;
    coinGeckoId: string;
    icon: SvgIcon;
    zcIcon?: SvgIcon;
    isCollateral: boolean;
    toBaseUnit: (amount: number | string) => bigint;
    fromBaseUnit: (amount: bigint) => number;
    toCurrency: () => CurrencyInterface;
    roundingDecimal: number;
    longName: string;
};

export const toCurrency = (ccy: CurrencySymbol) => {
    return currencyMap[ccy].toCurrency();
};

export function toCurrencySymbol(ccy: string) {
    switch (ccy) {
        case CurrencySymbol.FIL:
            return CurrencySymbol.FIL;
        case CurrencySymbol.tFIL:
            return CurrencySymbol.tFIL;
        case CurrencySymbol.iFIL:
            return CurrencySymbol.iFIL;
        case CurrencySymbol.sfUSD:
            return CurrencySymbol.sfUSD;
        default:
            return undefined;
    }
}

export function hexToCurrencySymbol(hex: string) {
    return toCurrencySymbol(fromBytes32(hex));
}

const convertToBlockchainUnit = (amount: number | string, ccy: Currency) => {
    const value = new BigNumberJS(amount).multipliedBy(10 ** ccy.decimals);

    if (value.isNaN() || value.isLessThan(new BigNumberJS(1))) {
        return ZERO_BI;
    }
    return BigInt(value.toString());
};

const convertFromBlockchainUnit = (amount: bigint, ccy: Currency) => {
    const value = new BigNumberJS(amount.toString()).dividedBy(
        10 ** ccy.decimals
    );
    return value.toNumber();
};

export const multiply = (
    valueA: number | bigint,
    valueB: number | bigint,
    precision = 2
) => {
    return parseFloat(
        new BigNumberJS(valueA.toString())
            .multipliedBy(valueB.toString())
            .toFixed(precision)
    );
};

export const divide = (
    valueA: number | bigint,
    valueB: number | bigint,
    precision = 2
) => {
    return parseFloat(
        new BigNumberJS(valueA.toString())
            .dividedBy(valueB.toString())
            .toFixed(precision)
    );
};
