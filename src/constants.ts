export const HEADER_LINKS = [
    {
        to: '/',
        label: 'Dashboard',
    },
    {
        to: '/trove',
        label: 'Trove',
    },
    {
        to: '/stability-pool',
        label: 'Stability Pool',
    },
    {
        to: '/stake',
        label: 'Stake SFC',
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

export const coinGeckoUrl = 'https://www.coingecko.com/en/coins/usdfc';

export const SOCIAL_LINKS = [
    {
        href: 'https://github.com/Secured-Finance/stablecoin-app',
        iconName: 'github',
        ariaLabel: 'GitHub',
    },
    {
        href: 'https://discord.gg/3kytCrv3qY',
        iconName: 'discord',
        ariaLabel: 'Discord',
    },
    {
        href: 'https://x.com/USDFC_Protocol',
        iconName: 'x-twitter',
        ariaLabel: 'Twitter',
    },
    {
        href: 'https://blog.secured.finance/',
        iconName: 'medium',
        ariaLabel: 'Medium',
    },
];
