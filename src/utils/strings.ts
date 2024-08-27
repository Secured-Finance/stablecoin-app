import { getEnvironment } from './env';

export enum Environment {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
}

export const formatDataCy = (str: string): string => {
    return str.replace(/\s+/g, '-').toLowerCase();
};

export const getEnvShort = (): 'dev' | 'stg' | 'prod' | '' => {
    const env = getEnvironment();
    switch (env.toLowerCase()) {
        case Environment.DEVELOPMENT:
            return 'dev';
        case Environment.STAGING:
            return 'stg';
        case Environment.PRODUCTION:
            return 'prod';
        default:
            return '';
    }
};

export const prefixTilde = (value: string): string => {
    return value ? `~ ${value}` : '';
};
