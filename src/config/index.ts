/* eslint-disable no-console */
import { getAddress, isAddress } from '@ethersproject/address';

export type LiquityFrontendConfig = {
    frontendTag: string;
    infuraApiKey?: string;
    alchemyApiKey?: string;
    testnetOnly?: boolean;
    walletConnectProjectId: string;
};

const defaultConfig: LiquityFrontendConfig = {
    frontendTag: '0xA12c287E3e61e13F346FA85527Eaa39648962466',
    testnetOnly: true,
    alchemyApiKey: 'm-w08JDeYLZeOUiSLqqP6knzePXomYXF',
    walletConnectProjectId: '9e84ebddd063e9ffd0a2728fe25ca07e',
};

function hasKey<K extends string>(o: object, k: K): o is Record<K, unknown> {
    return k in o;
}

const parseConfig = (json: unknown): LiquityFrontendConfig => {
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

        if (hasKey(json, 'infuraApiKey') && json.infuraApiKey !== '') {
            const { infuraApiKey } = json;

            if (typeof infuraApiKey === 'string') {
                config.infuraApiKey = infuraApiKey;
            } else {
                console.error('Malformed infuraApiKey:');
                console.log(infuraApiKey);
            }
        }

        if (hasKey(json, 'alchemyApiKey') && json.alchemyApiKey !== '') {
            const { alchemyApiKey } = json;

            if (typeof alchemyApiKey === 'string') {
                config.alchemyApiKey = alchemyApiKey;
            } else {
                console.error('Malformed alchemyApiKey:');
                console.log(alchemyApiKey);
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

let configPromise: Promise<LiquityFrontendConfig> | undefined = undefined;

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

export const getConfig = (): Promise<LiquityFrontendConfig> => {
    if (!configPromise) {
        configPromise = fetchConfig();
    }

    return configPromise;
};
