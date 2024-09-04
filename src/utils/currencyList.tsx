import { BigNumber as BigNumberJS } from 'bignumber.js';
import BtcIcon from 'src/assets/coins/btc.svg';
import FilIcon from 'src/assets/coins/fil.svg';
import IFilIcon from 'src/assets/coins/ifil.svg';
import UsdcIcon from 'src/assets/coins/usdc.svg';
import WBtcIcon from 'src/assets/coins/wbtc.svg';
import WFilIcon from 'src/assets/coins/wfil.svg';
import ZcBtcIcon from 'src/assets/coins/zc-btc.svg';
import ZcFilIcon from 'src/assets/coins/zc-fil.svg';
import ZcUsdcIcon from 'src/assets/coins/zc-usdc.svg';
import { SvgIcon } from 'src/types';
import {
    AXLFIL,
    BTCB,
    Currency,
    Currency as CurrencyInterface,
    FIL,
    IFIL,
    USDC,
    WBTC,
    WFIL,
} from 'src/utils/currencies';
import { hexToString } from 'viem';

BigNumberJS.set({ EXPONENTIAL_AT: 30 }); // setting to a decent limit

export const ZERO_BI = BigInt(0);

export enum CurrencySymbol {
    FIL = 'FIL',
    WFIL = 'WFIL',
    USDC = 'USDC',
    WBTC = 'WBTC',
    BTCb = 'BTC.b',
    axlFIL = 'axlFIL',
    iFIL = 'iFIL',
}

export const currencyMap: Readonly<
    Record<CurrencySymbol, Readonly<CurrencyInfo>>
> = {
    [CurrencySymbol.USDC]: {
        index: 0,
        symbol: CurrencySymbol.USDC,
        name: USDC.onChain().name,
        icon: UsdcIcon,
        zcIcon: ZcUsdcIcon,
        coinGeckoId: 'usd-coin',
        isCollateral: true,
        toBaseUnit: (amount: number | string) =>
            convertToBlockchainUnit(amount, USDC.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, USDC.onChain()),
        toCurrency: () => USDC.onChain(),
        // chartColor: tailwindConfig.theme.colors.chart.usdc,
        // pillColor: tailwindConfig.theme.colors.pill.usdc,
        roundingDecimal: 0,
        longName: 'USD Coin',
    },
    [CurrencySymbol.WBTC]: {
        index: 1,
        symbol: CurrencySymbol.WBTC,
        name: WBTC.onChain().name,
        icon: WBtcIcon,
        zcIcon: ZcBtcIcon,
        coinGeckoId: 'wrapped-bitcoin',
        isCollateral: true,
        toBaseUnit: (amount: number | string) =>
            convertToBlockchainUnit(amount, WBTC.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, WBTC.onChain()),
        toCurrency: () => WBTC.onChain(),
        // chartColor: tailwindConfig.theme.colors.chart.btc,
        // pillColor: tailwindConfig.theme.colors.pill.btc,
        roundingDecimal: 4,
        longName: 'Bitcoin',
    },
    [CurrencySymbol.BTCb]: {
        index: 2,
        symbol: CurrencySymbol.BTCb,
        name: BTCB.onChain().name,
        icon: BtcIcon,
        zcIcon: ZcBtcIcon,
        coinGeckoId: 'wrapped-bitcoin',
        isCollateral: true,
        toBaseUnit: (amount: number | string) =>
            convertToBlockchainUnit(amount, BTCB.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, BTCB.onChain()),
        toCurrency: () => BTCB.onChain(),
        // chartColor: tailwindConfig.theme.colors.chart.btc,
        // pillColor: tailwindConfig.theme.colors.pill.btc,
        roundingDecimal: 4,
        longName: 'Bitcoin',
    },
    [CurrencySymbol.FIL]: {
        index: 3,
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
        // chartColor: tailwindConfig.theme.colors.chart.fil,
        // pillColor: tailwindConfig.theme.colors.pill.fil,
        roundingDecimal: 0,
        longName: 'Filecoin',
    },
    [CurrencySymbol.WFIL]: {
        index: 4,
        symbol: CurrencySymbol.WFIL,
        name: WFIL.onChain().name,
        icon: WFilIcon,
        zcIcon: ZcFilIcon,
        coinGeckoId: 'filecoin',
        isCollateral: false,
        toBaseUnit: (amount: number | string) =>
            convertToBlockchainUnit(amount, WFIL.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, WFIL.onChain()),
        toCurrency: () => WFIL.onChain(),
        // chartColor: tailwindConfig.theme.colors.chart.fil,
        // pillColor: tailwindConfig.theme.colors.pill.fil,
        roundingDecimal: 0,
        longName: 'Wrapped Filecoin',
    },
    [CurrencySymbol.axlFIL]: {
        index: 5,
        symbol: CurrencySymbol.axlFIL,
        name: 'Axelar Wrapped FIL',
        icon: WFilIcon,
        zcIcon: ZcFilIcon,
        coinGeckoId: 'filecoin',
        isCollateral: false,
        toBaseUnit: (amount: number | string) =>
            convertToBlockchainUnit(amount, AXLFIL.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, AXLFIL.onChain()),
        toCurrency: () => AXLFIL.onChain(),
        // chartColor: tailwindConfig.theme.colors.chart.fil,
        // pillColor: tailwindConfig.theme.colors.pill.fil,
        roundingDecimal: 0,
        longName: 'Axelar Wrapped FIL',
    },
    [CurrencySymbol.iFIL]: {
        index: 6,
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
        // chartColor: tailwindConfig.theme.colors.chart.fil,
        // pillColor: tailwindConfig.theme.colors.pill.fil,
        roundingDecimal: 0,
        longName: 'Infinity Pool Staked FIL',
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
    // chartColor: string;
    // pillColor: string;
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
        case CurrencySymbol.WFIL:
            return CurrencySymbol.WFIL;
        case CurrencySymbol.USDC:
            return CurrencySymbol.USDC;
        case CurrencySymbol.WBTC:
            return CurrencySymbol.WBTC;
        case CurrencySymbol.BTCb:
            return CurrencySymbol.BTCb;
        case CurrencySymbol.axlFIL:
            return CurrencySymbol.axlFIL;
        case CurrencySymbol.iFIL:
            return CurrencySymbol.iFIL;
        default:
            return undefined;
    }
}

export function hexToCurrencySymbol(hex: string) {
    return toCurrencySymbol(hexToString(hex as `0x${string}`, { size: 32 }));
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
