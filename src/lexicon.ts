import { t } from 'i18next';

export type Lexicon = {
    term: string;
    description?: string;
};

export const BORROW_FEE: Lexicon = {
    term: t('common.borrowing-fee'),
    description: t('stablecoin-stats.borrowing-fee-desc'),
};

export const TVL: Lexicon = {
    term: t('stablecoin-stats.tvl'),
    description: t('stablecoin-stats.tvl-desc'),
};

export const STAKED_PROTOCOL_TOKEN: Lexicon = {
    term: 'Staked SCR',
    description:
        'The total amount of SCR that is staked for earning fee revenue.',
};

export const TCR: Lexicon = {
    term: t('stablecoin-stats.collateral-ratio'),
    description: t('stablecoin-stats.collateral-ratio-desc'),
};

export const RECOVERY_MODE: Lexicon = {
    term: t('stablecoin-stats.recovery-mode'),
    description: t('stablecoin-stats.recovery-mode-desc'),
};

export const STABILITY_POOL_DEBT_TOKEN: Lexicon = {
    term: t('stablecoin-stats.stablecoin-stability-pool'),
    description: t('stablecoin-stats.stablecoin-stability-pool-desc'),
};

export const KICKBACK_RATE: Lexicon = {
    term: 'Kickback Rate',
    description:
        'A rate between 0 and 100% set by the Frontend Operator that determines the fraction of SCR that will be paid out as a kickback to the Stability Providers using the frontend.',
};

export const tFIL: Lexicon = {
    term: 'tFIL',
};

export const DEBT_TOKEN: Lexicon = {
    term: 'USDFC',
};

export const PROTOCOL_TOKEN: Lexicon = {
    term: 'SCR',
};

export const TROVES: Lexicon = {
    term: 'Troves',
    description: t('stablecoin-stats.troves-desc'),
};

export const DEBT_TOKEN_SUPPLY: Lexicon = {
    term: t('stablecoin-stats.stablecoin-supply'),
    description: t('stablecoin-stats.stablecoin-supply-desc'),
};
