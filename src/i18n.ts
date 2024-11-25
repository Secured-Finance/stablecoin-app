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
                    common: {
                        deposit: 'Deposit',
                        liquidate: 'Liquidate',
                        liquidated: 'Liquidated',
                        trove: 'Trove',
                        'connect-wallet': 'Connect Wallet',
                        stablecoin: 'Stablecoin',
                        'risky-troves': 'Risky Troves',
                        'riskiest-troves': 'Riskiest Troves',
                        'fixed-income': 'Fixed Income',
                        protocol: 'Protocol',
                        debt: 'Debt',
                        collateral: 'Collateral',
                        'collateral-ratio': 'Collateral ratio',
                        'coll-ratio': 'Coll. Ratio',
                        adjust: 'Adjust',
                        'liquidation-reserve': 'Liquidation Reserve',
                        'borrowing-fee': 'Borrowing Fee',
                        'total-debt': 'Total debt',
                        max: 'Max',
                        cancel: 'Cancel',
                        confirm: 'Confirm',
                        'pool-share': 'Pool share',
                        owner: 'Owner',
                        yes: 'Yes',
                        no: 'No',
                        'open-trove': 'Open Trove',
                        borrow: 'Borrow',
                        redeemed: 'Redeemed',
                        loading: 'Loading',
                        development: 'Development',
                        stake: 'Stake',
                        staking: 'Staking',
                        claim: 'Claim',
                        'wait-approval': 'You must wait for confirmation',
                        'net-debt': 'Net debt',
                        'liquidation-gain': 'Liquidation gain',
                        'my-info': 'My Info',
                        'my-account-balances': 'My Account Balances',
                    },
                    'card-component': {
                        'price-feed': 'Price feed',
                        'stability-pool': 'Stability Pool',
                        'bot-functionality': 'Bot functionality',
                        'bot-liquidation':
                            'Liquidation is expected to be carried out by bots.',
                        'bot-liquidation-desc':
                            'Early on you may be able to manually liquidate Troves, but as the system matures this will become less likely.',
                        'collateral-ratio-warning':
                            'Keep your collateral ratio above 150% to avoid being liquidated under Recovery Mode.',
                        'close-trove': 'Close Trove',
                        'no-stability-pool':
                            'You have no USDFC in the Stability Pool.',
                        'no-stability-pool-desc':
                            'You can earn tFIL rewards by depositing USDFC.',
                        'adjust-trove-desc':
                            'Adjust your Trove by modifying its collateral, debt, or both.',
                        'deposit-instruction':
                            'Enter the amount of {{COIN}} you would like to deposit.',
                        'up-to': 'Up to',
                        'no-deposits': "You haven't borrowed any USDFC yet.",
                        'no-deposits-desc':
                            'You can mint and borrow USDFC by opening a Trove.',
                        'start-deposit-instruction':
                            'Start by entering the amount of tFIL you would like to deposit as collateral.',
                        'collateral-warning':
                            'Collateral ratio must be at least 110%.',
                        'go-to-market': 'Go to Market',
                        'lend-instructions':
                            'Lend USDFC to earn fixed returns and acquire zero-coupon bonds.',
                        'ratio-not-low': 'Collateral ratio not low enough',
                        'trove-redeemed': 'Your Trove has been redeemed.',
                        'trove-liquidated': 'Your Trove has been liquidated.',
                        'reclaim-collateral':
                            'Please reclaim your remaining collateral before opening a new Trove.',
                        'borrow-instructions':
                            'You can borrow USDFC by opening a Trove.',
                        'waiting-approval': 'Waiting for your approval',
                        'need-to-repay': 'You will need to repay',
                        'reserve-excluded':
                            'USDFC Liquidation Reserve excluded',
                        'to-reclaim-collateral':
                            'USDFC to reclaim your collateral',
                        'total-hold':
                            'The total amount of USDFC your Trove will hold.',
                        'high-cost-trove':
                            'The cost of opening a Trove in this collateral ratio range is rather high. To lower it, choose a slightly different collateral ratio.',
                        'adjust-amount':
                            'Adjust the {{COIN}} amount to deposit or withdraw.',
                        'move-to-trove': 'Move {{COIN}} to Trove',
                    },
                    'stablecoin-stats': {
                        title: 'SF Stablecoin Statistics',
                        contracts: 'Contracts version',
                        deployed: 'Deployed',
                        frontend: 'Frontend version',
                        'borrowing-fee-desc':
                            "The Borrowing Fee is a one-off fee charged as a percentage of the borrowed amount (in USDFC) and is part of a Trove's debt. The fee varies between 0.5% and 5% depending on USDFC redemption volumes.",
                        tvl: 'TVL',
                        'tvl-desc':
                            'The Total Value Locked (TVL) is the total value of Ether locked as collateral in the system, given in tFIL and USD.',
                        'troves-desc':
                            'The total number of active Troves in the system.',
                        'stablecoin-supply': 'USDFC supply',
                        'stablecoin-supply-desc':
                            'The total USDFC minted by this protocol.',
                        'stablecoin-stability-pool': 'USDFC in Stability Pool',
                        'stablecoin-stability-pool-desc':
                            'The total USDFC currently held in the Stability Pool, expressed as an amount and a fraction of the USDFC supply.',
                        'collateral-ratio': 'Total Collateral Ratio',
                        'collateral-ratio-desc':
                            'The ratio of the Dollar value of the entire system collateral at the current tFIL:USD price, to the entire system debt.',
                        'recovery-mode': 'Recovery Mode',
                        'recovery-mode-desc':
                            "Recovery Mode is activated when the Total Collateral Ratio (TCR) falls below 150%. When active, your Trove can be liquidated if its collateral ratio is below the TCR. The maximum collateral you can lose from liquidation is capped at 110% of your Trove's debt. Operations are also restricted that would negatively impact the TCR.",
                        'close-trove-alert':
                            'You need 0.90 USDFC more to close your Trove.',
                    },
                    tooltips: {
                        'collateral-ratio':
                            'The ratio between the dollar value of the collateral and the debt (in USDFC) you are depositing. While the Minimum Collateral Ratio is 110% during normal operation, it is recommended to keep the Collateral Ratio always above 150% to avoid liquidation under Recovery Mode. A Collateral Ratio above 200% or 250% is recommended for additional safety.',
                        'total-debt':
                            'The total amount of USDFC your Trove will hold.',
                        'borrowing-fee':
                            'This amount is deducted from the borrowed amount as a one-time fee. There are no recurring fees for borrowing, which is thus interest-free.',
                        'liquidation-reserve':
                            'An amount set aside to cover the liquidator’s gas costs if your Trove needs to be liquidated. The amount increases your debt and is refunded if you close your Trove by fully paying off its net debt.',
                    },
                },
            },
            zh: {
                translation: {
                    common: {
                        deposit: '存款',
                        liquidate: '清算',
                        liquidated: '已清算',
                        trove: 'Trove',
                        'connect-wallet': '连接钱包',
                        stablecoin: '稳定币',
                        'risky-troves': '高风险 Troves',
                        'riskiest-troves': '最高风险 Troves',
                        'fixed-income': '固定收益',
                        protocol: '协议',
                        debt: '债务',
                        collateral: '抵押品',
                        'collateral-ratio': '抵押比例',
                        'coll-ratio': '抵押比例',
                        adjust: '调整',
                        'liquidation-reserve': '清算准备金',
                        'borrowing-fee': '借款费用',
                        'total-debt': '债务总额',
                        max: '最大限度',
                        cancel: '取消',
                        confirm: '确认',
                        'pool-share': '资金池份额',
                        owner: '所有者',
                        yes: '是',
                        no: '否',
                        'open-trove': '打开Trove',
                        borrow: '借',
                        redeemed: '已赎回',
                        loading: '加载中',
                        development: 'Development',
                        stake: '赌注',
                        staking: '质押',
                        claim: '宣称',
                        'wait-approval': '你必须等待确认',
                        'net-debt': '净债务',
                        'liquidation-gain': '清算收益',
                        'my-info': '信息',
                        'my-account-balances': '我的账户余额',
                    },
                    'card-component': {
                        'price-feed': '价格反馈',
                        'stability-pool': '稳定池',
                        'bot-functionality': '机器人功能',
                        'bot-liquidation': '预计清算将由机器人进行。',
                        'bot-liquidation-desc':
                            '在早期阶段，您可能可以手动清算Trove，但随着系统逐渐成熟，这种可能性会降低。',
                        'collateral-ratio-warning':
                            '请将抵押品比例保持在 150% 以上，避免在恢复模式下被清算。',
                        'close-trove': '关闭Trove',
                        'no-stability-pool': '您的稳定池中没有 USDFC。',
                        'no-stability-pool-desc':
                            '您可以通过充值USDFC来赚取tFIL奖励。',
                        'adjust-trove-desc':
                            '通过修改其抵押品、债务或两者来调整您的宝库。',
                        'deposit-instruction':
                            '输入您想要存入的 {{COIN}} 金额。',
                        'up-to': '最多',
                        'no-deposits': '您尚未借入任何 USDFC。',
                        'no-deposits-desc':
                            '您可以通过开设 Trove 来铸造和借用 USDFC。',
                        'start-deposit-instruction':
                            '请先输入您想要作为抵押品存入的tFIL数量。',
                        'collateral-warning': '抵押比例必须至少为 110%。',
                        'go-to-market': '',
                        'lend-instructions':
                            '借出 USDFC 以获得固定回报并购买零息债券。',
                        'ratio-not-low': '抵押比例不够低',
                        'trove-redeemed': '你的Trove已被赎回。',
                        'trove-liquidated': '您的Trove已被清算。',
                        'reclaim-collateral':
                            '请在打开新的 Trove 之前收回您剩余的抵押品。',
                        'borrow-instructions':
                            '您可以通过开设 Trove 来借用 USDFC。',
                        'waiting-approval': '等待您的批准',
                        'need-to-repay': '你将需要偿还',
                        'reserve-excluded': '不包括 USDFC 清算储备',
                        'to-reclaim-collateral': 'USDFC 收回您的抵押品',
                        'total-hold': '您的 Trove 将持有的 USDFC 总量。',
                        'high-cost-trove':
                            '在这个抵押率范围内开设Trove的成本相当高。要降低它，请选择稍微不同的抵押品比率。',
                        'adjust-amount': '调整存款或取款的{{COIN}}金额。',
                        'move-to-trove': '将 {{COIN}} 移至 Trove',
                    },
                    'stablecoin-stats': {
                        title: 'SF 稳定币统计',
                        contracts: '合约版本',
                        deployed: '部署',
                        frontend: '前端版本',
                        'borrowing-fee-desc':
                            '借款费用是按借款金额（以USDFC计）的一定百分比收取的一次性费用，构成Trove债务的一部分。费用会在0.5%至5%之间浮动，具体取决于USDFC赎回量。',
                        tvl: 'TVL（总锁定价值）',
                        'tvl-desc':
                            '总锁仓价值（TVL）是指系统中锁定的以太坊抵押品的总价值，以tFIL和USD计价。',
                        'troves-desc': '系统中活跃的Trove总数。',
                        'stablecoin-supply': 'USDFC供应量',
                        'stablecoin-supply-desc': '该协议发行的USDFC总量。',
                        'stablecoin-stability-pool': '稳定池中的USDFC',
                        'stablecoin-stability-pool-desc':
                            '当前稳定池中持有的USDFC总量，以金额和占USDFC供应量的比例表示。',
                        'collateral-ratio': '总抵押率',
                        'collateral-ratio-desc':
                            '以当前tFIL:USD价格计算，整个系统抵押品的美元价值与系统总债务的比率。',
                        'recovery-mode': '恢复模式',
                        'recovery-mode-desc':
                            '当总抵押率（TCR）低于150%时，恢复模式会被激活。当恢复模式生效时，如果Trove的抵押率低于TCR，可能会被清算。清算过程中您损失的最大抵押品金额被限制在您Trove债务的110%以内。同时，限制可能对TCR产生负面影响的操作。',
                        'close-trove-alert':
                            '您还需要 0.90 USDFC 才能关闭您的 Trove。',
                    },
                    tooltips: {
                        'collateral-ratio':
                            '抵押品美元价值与您存入的债务（USDFC）之间的比率。虽然在正常运行期间最低抵押率为110%，但建议始终将抵押率保持在150%以上，以避免在恢复模式下被清算。为了额外安全，建议将抵押率维持在200%或250%以上。',
                        'total-debt': '您的 Trove 将持有的 USDFC 总量。',
                        'borrowing-fee':
                            '这笔费用将从借入金额中一次性扣除。借款没有周期性费用，因此是免息的。',
                        'liquidation-reserve':
                            '这是一笔预留金额，用于在您的金库需要被清算时支付清算人的gas费用。这笔金额会增加您的债务，但如果您通过完全偿还净债务来关闭金库，这笔金额将被退还。',
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
