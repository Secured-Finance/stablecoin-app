/* eslint-disable no-console */
import { getAddress, isAddress } from '@ethersproject/address';
import { getSquidWidgetIntegratorId } from 'src/utils';

export type FrontendConfig = {
    frontendTag: string;
    testnetOnly?: boolean;
};

const defaultConfig: FrontendConfig = {
    frontendTag: '0xDBA767F3DFF3835BEf5dE1eDEe91A9901402AB21',
    testnetOnly: true,
};

function hasKey<K extends string>(o: object, k: K): o is Record<K, unknown> {
    return k in o;
}

const parseConfig = (json: unknown): FrontendConfig => {
    const config = { ...defaultConfig };

    if (typeof json === 'object' && json !== null) {
        if (hasKey(json, 'frontendTag') && json.frontendTag !== '') {
            const { frontendTag } = json;

            if (typeof frontendTag === 'string' && isAddress(frontendTag)) {
                config.frontendTag = getAddress(frontendTag);
            } else {
                console.error('Malformed frontendTag:');
                console.log(frontendTag);
            }
        }

        if (hasKey(json, 'testnetOnly')) {
            const { testnetOnly } = json;

            if (typeof testnetOnly === 'boolean') {
                config.testnetOnly = testnetOnly;
            } else {
                console.error('Malformed testnetOnly:');
                console.log(testnetOnly);
            }
        }
    } else {
        console.error('Malformed config:');
        console.log(json);
    }

    return config;
};

let configPromise: Promise<FrontendConfig> | undefined = undefined;

const fetchConfig = async () => {
    try {
        const response = await fetch('config.json');

        if (!response.ok) {
            throw new Error(
                `Failed to fetch config.json (status ${response.status})`
            );
        }

        return parseConfig(await response.json());
    } catch (err) {
        console.error(err);
        return { ...defaultConfig };
    }
};

export const getConfig = (): Promise<FrontendConfig> => {
    if (!configPromise) {
        configPromise = fetchConfig();
    }

    return configPromise;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const squidConfig: any = {
    integratorId: getSquidWidgetIntegratorId(),
    theme: {
        borderRadius: {
            'button-lg-primary': '1rem',
            'button-lg-secondary': '1.25rem',
            'button-lg-tertiary': '1.25rem',
            'button-md-primary': '1rem',
            'button-md-secondary': '0.9375rem',
            'button-md-tertiary': '0.9375rem',
            container: '1.25rem',
            input: '0.8rem',
            'menu-sm': '0.65rem',
            'menu-lg': '0.65rem',
            modal: '1.5rem',
        },
        fontSize: {
            caption: '1rem',
            'body-small': '1.25rem',
            'body-medium': '1.5rem',
            'body-large': '1.75rem',
            'heading-small': '2.25rem',
            'heading-medium': '3.08125rem',
            'heading-large': '4.40625rem',
        },
        fontWeight: {
            caption: '400',
            'body-small': '400',
            'body-medium': '400',
            'body-large': '400',
            'heading-small': '400',
            'heading-medium': '400',
            'heading-large': '400',
        },
        fontFamily: {
            'squid-main': 'Inter Variable',
        },
        boxShadow: {
            container:
                '0px 2px 5px 1px rgba(0, 0, 0, 0.20), 0px 5px 20px -1px rgba(0, 0, 0, 0.33)',
        },
        color: {
            'grey-100': '#FBFBFD',
            'grey-200': '#EDEFF3',
            'grey-300': '#5162FF',
            'grey-400': '#A7ABBE',
            'grey-500': '#475569',
            'grey-600': '#64748b',
            'grey-700': '#4C515D',
            'grey-800': '#e2e8f0',
            'grey-900': '#F8FAFC',
            'royal-300': '#D9BEF4',
            'royal-400': '#B893EC',
            'royal-500': '#5162FF',
            'royal-600': '#8353C5',
            'royal-700': '#6B45A1',
            'status-positive': '#5CD167',
            'status-negative': '#FF658A',
            'status-partial': '#15D6E8',
            'highlight-700': '#E4FE53',
            'animation-bg': '#5162FF',
            'animation-text': '#FBFBFD',
            'button-lg-primary-bg': '#5162FF',
            'button-lg-primary-text': '#FBFBFD',
            'button-lg-secondary-bg': '#FBFBFD',
            'button-lg-secondary-text': '#292C32',
            'button-lg-tertiary-bg': '#292C32',
            'button-lg-tertiary-text': '#D1D6E0',
            'button-md-primary-bg': '#5162FF',
            'button-md-primary-text': '#FBFBFD',
            'button-md-secondary-bg': '#FBFBFD',
            'button-md-secondary-text': '#292C32',
            'button-md-tertiary-bg': '#292C32',
            'button-md-tertiary-text': '#D1D6E0',
            'input-bg': '#F1F5F9',
            'input-placeholder': '#64748b',
            'input-text': '#002133',
            'input-selection': '#D1D6E0',
            'menu-bg': '#F1F5F9',
            'menu-text': '#002133',
            'menu-backdrop': '#FBFBFD1A',
            'modal-backdrop': '#cbd5e1',
        },
    },
    themeType: 'dark',
    apiUrl: 'https://apiplus.squidrouter.com',
    priceImpactWarnings: {
        warning: 3,
        critical: 5,
    },
    initialAssets: {
        from: {
            address: '0x0d8ce2a99bb6e3b7db580ed848240e4a0f9ae153',
            chainId: '314',
        },
    },
};
