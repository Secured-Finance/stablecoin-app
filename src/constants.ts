export const LINKS = [
    {
        to: '/',
        label: 'Dashboard',
    },
    {
        to: '/risky-troves',
        label: 'Risky Troves',
    },
    {
        to: '/bridge',
        label: 'Bridge',
    },
];

export const DOCUMENTATION_LINK =
    'https://docs.secured.finance/stablecoin-protocol-guide';

const ankerApiKey = process.env.NEXT_PUBLIC_ANKER_API_KEY ?? '';

export const DOCUMENTATION_LINKS = {
    liquidation: `${DOCUMENTATION_LINK}/key-features/stability-pool-and-liquidation#what-are-liquidations`,
    redemption: `${DOCUMENTATION_LINK}/key-features/redemption`,
    recoveryMode: `${DOCUMENTATION_LINK}/key-features/recovery-mode`,
};

export const BLOCKCHAIN_EXPLORER_LINKS = {
    mainnet: 'https://filfox.info',
    testnet: 'https://calibration.filfox.info',
};

export const PYTH_ORACLE_LINK =
    'https://www.pyth.network/price-feeds/crypto-fil-usd';

export const TELLOR_ORACLE_LINKS = {
    mainnet:
        'https://filfox.info/en/address/0x8cFc184c877154a8F9ffE0fe75649dbe5e2DBEbf?t=3',
    testnet:
        'https://calibration.filfox.info/en/address/0xb2CB696fE5244fB9004877e58dcB680cB86Ba444?t=3',
};

export const rpcUrls = {
    mainnet: `https://rpc.ankr.com/filecoin/${ankerApiKey}`,
    testnet: `https://rpc.ankr.com/filecoin_testnet/${ankerApiKey}`,
};

export const wsUrls = {
    mainnet: `wss://rpc.ankr.com/filecoin/${ankerApiKey}`,
    testnet: `wss://rpc.ankr.com/filecoin_testnet/${ankerApiKey}`,
};
