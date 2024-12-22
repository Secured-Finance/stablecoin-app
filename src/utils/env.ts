import assert from 'assert';
import { Environment } from './strings';

export const getWalletConnectId = () => {
    const walletConnectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;
    assert(walletConnectId, 'NEXT_PUBLIC_WALLET_CONNECT_ID is not set');
    return walletConnectId;
};

export const getAmplitudeApiKey = () => {
    const NEXT_PUBLIC_AMPLITUDE_API_KEY =
        process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

    if (!NEXT_PUBLIC_AMPLITUDE_API_KEY) {
        // eslint-disable-next-line no-console
        console.warn('Amplitude API is not set: no analytics will be sent');
        return '';
    }

    return NEXT_PUBLIC_AMPLITUDE_API_KEY;
};

export const getEnvironment = () => {
    const SF_ENV = process.env.SF_ENV;

    if (!SF_ENV) {
        // eslint-disable-next-line no-console
        console.warn('SF_ENV is not set, defaulting to development');
        return Environment.DEVELOPMENT;
    }

    return SF_ENV;
};

export const getSetPriceEnabled = () => {
    const NEXT_PUBLIC_SET_PRICE_ENABLED =
        process.env.NEXT_PUBLIC_SET_PRICE_ENABLED;

    if (!NEXT_PUBLIC_SET_PRICE_ENABLED) {
        return false;
    }

    return NEXT_PUBLIC_SET_PRICE_ENABLED === 'true';
};

export const getSquidWidgetIntegratorId = () => {
    const SQUID_WIDGET_INTEGRATOR_ID =
        process.env.NEXT_PUBLIC_SQUID_WIDGET_INTEGRATOR_ID;

    if (!SQUID_WIDGET_INTEGRATOR_ID) {
        return '';
    }

    return SQUID_WIDGET_INTEGRATOR_ID;
};
