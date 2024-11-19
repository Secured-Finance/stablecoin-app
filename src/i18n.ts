import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .use(LanguageDetector)
    .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources: {
            en: {
                translation: {
                    'stablecoin-stats': {
                        title: 'SF Stablecoin Statistics',
                        protocol: 'Protocol',
                        'borrowing-fee': {
                            term: 'Borrowing Fee',
                            description:
                                "The Borrowing Fee is a one-off fee charged as a percentage of the borrowed amount (in USDFC) and is part of a Trove's debt. The fee varies between 0.5% and 5% depending on USDFC redemption volumes.",
                        },
                        tvl: {
                            term: 'TVL',
                            description:
                                'The Total Value Locked (TVL) is the total value of Ether locked as collateral in the system, given in tFIL and USD.',
                        },
                        troves: {
                            term: 'Troves',
                            description:
                                'The total number of active Troves in the system.',
                        },
                        'stablecoin-supply': {
                            term: 'USDFC supply',
                            description:
                                'The total USDFC minted by this protocol.',
                        },
                        'stablecoin-stability-pool': {
                            term: 'USDFC in Stability Pool',
                            description:
                                'The total USDFC currently held in the Stability Pool, expressed as an amount and a fraction of the USDFC supply.',
                        },
                        'collateral-ratio': {
                            term: 'Total Collateral Ratio',
                            description:
                                'The ratio of the Dollar value of the entire system collateral at the current tFIL:USD price, to the entire system debt.',
                        },
                        'recovery-mode': {
                            term: 'Recovery Mode',
                            description:
                                "Recovery Mode is activated when the Total Collateral Ratio (TCR) falls below 150%. When active, your Trove can be liquidated if its collateral ratio is below the TCR. The maximum collateral you can lose from liquidation is capped at 110% of your Trove's debt. Operations are also restricted that would negatively impact the TCR.",
                        },
                    },
                    common: {
                        'connect-wallet': 'Connect Wallet',
                    },
                    header: {
                        nav: {
                            stablecoin: 'Stablecoin',
                            'risky-troves': 'Risky Troves',
                        },
                        'fixed-income': 'Fixed Income',
                    },
                    'risky-troves': {
                        title: 'Bot functionality',
                        body1: 'Liquidation is expected to be carried out by bots.',
                        body2: 'Early on you may be able to manually liquidate Troves, but as the system matures this will become less likely.',
                    },
                },
            },
            zh: {
                translation: {
                    'stablecoin-stats': {
                        title: 'SF 稳定币统计',
                        protocol: '协议',
                        'borrowing-fee': {
                            term: '借款费用',
                            description:
                                '借款费用是按借款金额（以USDFC计）的一定百分比收取的一次性费用，构成Trove债务的一部分。费用根据USDFC赎回量的变化在0.5%至5%之间浮动。',
                        },
                        tvl: {
                            term: 'TVL（总锁定价值）',
                            description:
                                '总锁定价值（TVL）是系统中以以太坊作为抵押的总价值，以tFIL和美元表示。',
                        },
                        troves: {
                            term: 'Trove数量',
                            description: '系统中活跃的Trove总数。',
                        },
                        'stablecoin-supply': {
                            term: 'USDFC供应量',
                            description: '该协议发行的USDFC总量。',
                        },
                        'stablecoin-stability-pool': {
                            term: '稳定池中的USDFC',
                            description:
                                '当前稳定池中持有的USDFC总量，以金额和占USDFC供应量的比例表示。',
                        },
                        'collateral-ratio': {
                            term: '总抵押率',
                            description:
                                '以当前tFIL:USD价格计算，整个系统抵押品的美元价值与系统总债务的比率。',
                        },
                        'recovery-mode': {
                            term: '恢复模式',
                            description:
                                '当总抵押率（TCR）低于150%时，恢复模式会被激活。当恢复模式生效时，如果Trove的抵押率低于TCR，可能会被清算。清算过程中您损失的最大抵押品金额被限制在您Trove债务的110%以内。同时，限制可能对TCR产生负面影响的操作。',
                        },
                    },
                    common: {
                        'connect-wallet': '连接钱包',
                    },
                    header: {
                        nav: {
                            stablecoin: '稳定币',
                            'risky-troves': '危险的宝藏',
                        },
                        'fixed-income': '固定收益',
                    },
                    'risky-troves': {
                        title: '机器人功能',
                        body1: '预计清算将由机器人进行。',
                        body2: '早期，您可能能够手动清算宝藏，但随着系统的成熟，这种可能性将变得越来越小。',
                    },
                },
            },
        },
        // fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        },
        detection: {
            order: ['path', 'cookie', 'navigator'],
        },
    });
