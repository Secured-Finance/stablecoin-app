/* eslint-disable no-console */
import { getAddress, isAddress } from '@ethersproject/address';

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
