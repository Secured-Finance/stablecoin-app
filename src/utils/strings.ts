import { hexToString, stringToHex } from 'viem';
import { getEnvironment } from './env';

export enum Environment {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
}

export const FIXED_INCOME_MARKET_LINKS = {
    [Environment.DEVELOPMENT]: 'https://dev.secured.finance/',
    [Environment.STAGING]: 'https://stg.secured.finance/',
    [Environment.PRODUCTION]: 'https://app.secured.finance/',
};

export type EnvShort = 'dev' | 'stg' | 'prod';
export const ENV_SHORTS: Record<string, EnvShort> = {
    [Environment.DEVELOPMENT]: 'dev',
    [Environment.STAGING]: 'stg',
    [Environment.PRODUCTION]: 'prod',
};

export const formatDataCy = (str: string): string => {
    return str.replace(/\s+/g, '-').toLowerCase();
};

export const getEnvShort = (): EnvShort => {
    return ENV_SHORTS[getEnvironment()];
};

export const getFixedIncomeMarketLink = () => {
    return FIXED_INCOME_MARKET_LINKS[getEnvironment()];
};

export const prefixTilde = (value: string): string => {
    return value ? `~ ${value}` : '';
};

export const toBytes32 = (text: string) => {
    return stringToHex(text, { size: 32 });
};

export const fromBytes32 = (hex: string) => {
    return hexToString(hex as `0x${string}`, { size: 32 });
};
