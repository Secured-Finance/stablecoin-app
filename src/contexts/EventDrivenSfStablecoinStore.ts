import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { Provider } from '@ethersproject/providers';
import { BlockTag } from '@ethersproject/abstract-provider';

import {
    Decimal,
    Fees,
    ProtocolTokenStake,
    SfStablecoinStore,
    SfStablecoinStoreBaseState,
    SfStablecoinStoreState,
    StabilityDeposit,
    TroveWithPendingRedistribution,
} from '@secured-finance/stablecoin-lib-base';

import {
    EthersConnection,
    ReadableEthers,
} from '@secured-finance/stablecoin-lib-ethers';

import { WebSocketProvider } from './WebSocketProvider';
import { wsUrls } from '../constants';

const decimalify = (value: unknown) => value;
const promiseAllValues = async <T extends Record<string, Promise<unknown>>>(
    promiseObject: T
): Promise<{ [P in keyof T]: Awaited<T[P]> }> => {
    const keys = Object.keys(promiseObject);
    const values = await Promise.all(Object.values(promiseObject));
    return Object.fromEntries(keys.map((key, i) => [key, values[i]])) as {
        [P in keyof T]: Awaited<T[P]>;
    };
};

type EthersCallOverrides = { blockTag?: BlockTag };
type EthersProvider = Provider;

/**
 * Extra state added to {@link @secured-finance/stablecoin-lib-base#SfStablecoinStoreState} by
 * {@link EventDrivenSfStablecoinStore}.
 *
 * @public
 */
export interface EventDrivenSfStablecoinStoreExtraState {
    /**
     * Number of block that the store state was fetched from.
     *
     * @remarks
     * May be undefined when the store state is fetched for the first time.
     */
    blockTag?: number;

    /**
     * Timestamp of latest block (number of seconds since epoch).
     */
    blockTimestamp: number;

    /** @internal */
    _feesFactory: (blockTimestamp: number, recoveryMode: boolean) => Fees;
}

/**
 * The type of {@link EventDrivenSfStablecoinStore}'s
 * {@link @secured-finance/stablecoin-lib-base#SfStablecoinStore.state | state}.
 *
 * @public
 */
export type EventDrivenSfStablecoinStoreState =
    SfStablecoinStoreState<EventDrivenSfStablecoinStoreExtraState>;

/**
 * Ethers-based {@link @secured-finance/stablecoin-lib-base#SfStablecoinStore} that updates state based on contract events
 * instead of polling, significantly reducing RPC calls.
 *
 * @public
 */
export class EventDrivenSfStablecoinStore extends SfStablecoinStore<EventDrivenSfStablecoinStoreExtraState> {
    readonly connection: EthersConnection;

    private readonly _readable: ReadableEthers;
    private readonly _provider: EthersProvider;
    private readonly _contracts: { [name: string]: Contract } = {};
    private _eventSubscriptions: { [eventName: string]: boolean } = {};
    private _lastUpdateTime = 0;
    private _updateThrottleMs = 2000; // Minimum time between updates
    private _pendingUpdate = false;

    private _wsProvider: WebSocketProvider | null = null;
    private _fallbackToPolling = false;

    constructor(readable: ReadableEthers) {
        super();

        this.connection = readable.connection;
        this._readable = readable;
        this._provider = readable.connection.provider;

        try {
            const chainId = this.connection.chainId;
            const isFilecoinMainnet = chainId.toString().startsWith('314');
            const wsUrl = isFilecoinMainnet ? wsUrls.mainnet : wsUrls.testnet;

            if (wsUrl) {
                this._wsProvider = new WebSocketProvider(wsUrl, chainId);
            } else {
                // eslint-disable-next-line no-console
                console.warn(
                    'No WebSocket URL available for this network, falling back to polling'
                );
                this._fallbackToPolling = true;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to create WebSocket provider:', error);
            this._fallbackToPolling = true;
        }
    }

    /**
     * Initialize contract instances for event listening
     */
    private async _initializeContracts(): Promise<void> {
        if (!this._wsProvider) {
            // eslint-disable-next-line no-console
            console.warn(
                'WebSocket provider not available, cannot initialize contracts'
            );
            return;
        }

        try {
            const addresses = this.connection.addresses;

            const troveManagerAddress = addresses['troveManager'];
            const stabilityPoolAddress = addresses['stabilityPool'];
            const borrowerOperationsAddress = addresses['borrowerOperations'];
            const debtTokenAddress = addresses['debtToken'];
            const protocolTokenAddress = addresses['protocolToken'];

            const troveManagerAbi = [
                'event TroveUpdated(address indexed _borrower, uint _debt, uint _coll, uint _stake, uint8 operation)',
                'event Redemption(uint _attemptedDebtAmount, uint _actualDebtAmount, uint _ETHSent, uint _ETHFee)',
                'event LTermsUpdated(uint _L_ETH, uint _L_DebtToken)',
                'event TroveLiquidated(address indexed _borrower, uint _debt, uint _coll, uint8 operation)',
                'event BaseRateUpdated(uint _baseRate)',
                'event LastFeeOpTimeUpdated(uint _lastFeeOpTime)',
                'event TotalStakesUpdated(uint _newTotalStakes)',
                'event SystemSnapshotsUpdated(uint _totalStakesSnapshot, uint _totalCollateralSnapshot)',
            ];

            const stabilityPoolAbi = [
                'event StabilityPoolDebtTokenBalanceUpdated(uint _newBalance)',
                'event StabilityPoolETHBalanceUpdated(uint _newBalance)',
                'event ETHGainWithdrawn(address indexed _depositor, uint _ETH, uint _DebtTokenLoss)',
                'event DepositSnapshotUpdated(address indexed _depositor, uint _P, uint _S, uint _G)',
            ];

            const borrowerOperationsAbi = [
                'event TroveCreated(address indexed _borrower, uint _arrayIndex)',
                'event TroveUpdated(address indexed _borrower, uint _debt, uint _coll, uint _stake, uint8 operation)',
            ];

            const tokenAbi = [
                'event Transfer(address indexed from, address indexed to, uint256 value)',
            ];

            if (troveManagerAddress) {
                this._contracts.troveManager = new Contract(
                    troveManagerAddress,
                    troveManagerAbi,
                    this._wsProvider
                );
            }

            if (stabilityPoolAddress) {
                this._contracts.stabilityPool = new Contract(
                    stabilityPoolAddress,
                    stabilityPoolAbi,
                    this._wsProvider
                );
            }

            if (borrowerOperationsAddress) {
                this._contracts.borrowerOperations = new Contract(
                    borrowerOperationsAddress,
                    borrowerOperationsAbi,
                    this._wsProvider
                );
            }

            if (debtTokenAddress) {
                this._contracts.debtToken = new Contract(
                    debtTokenAddress,
                    tokenAbi,
                    this._wsProvider
                );
            }

            if (protocolTokenAddress) {
                this._contracts.protocolToken = new Contract(
                    protocolTokenAddress,
                    tokenAbi,
                    this._wsProvider
                );
            }
        } catch (error) {
            console.error(
                'Failed to initialize contracts for event listening:',
                error
            );
            this._fallbackToPolling = true;
        }
    }

    private async _getRiskiestTroveBeforeRedistribution(
        overrides?: EthersCallOverrides
    ): Promise<TroveWithPendingRedistribution> {
        const riskiestTroves = await this._readable.getTroves(
            {
                first: 1,
                sortedBy: 'ascendingCollateralRatio',
                beforeRedistribution: true,
            },
            overrides
        );

        if (riskiestTroves.length === 0) {
            return new TroveWithPendingRedistribution(
                AddressZero,
                'nonExistent'
            );
        }

        return riskiestTroves[0];
    }

    private async _get(
        blockTag?: number
    ): Promise<
        [
            baseState: SfStablecoinStoreBaseState,
            extraState: EventDrivenSfStablecoinStoreExtraState
        ]
    > {
        const { userAddress, frontendTag } = this.connection;

        const basePromises: Record<string, Promise<unknown>> = {
            blockTimestamp: this._readable._getBlockTimestamp(blockTag),
            _feesFactory: this._readable._getFeesFactory({ blockTag }),
            calculateRemainingProtocolToken:
                this._readable._getRemainingProtocolMiningProtocolTokenRewardCalculator(
                    {
                        blockTag,
                    }
                ),

            price: this._readable.getPrice({ blockTag }),
            numberOfTroves: this._readable.getNumberOfTroves({ blockTag }),
            totalRedistributed: this._readable.getTotalRedistributed({
                blockTag,
            }),
            total: this._readable.getTotal({ blockTag }),
            debtTokenInStabilityPool:
                this._readable.getDebtTokenInStabilityPool({ blockTag }),
            totalStakedProtocolToken:
                this._readable.getTotalStakedProtocolToken({ blockTag }),
            _riskiestTroveBeforeRedistribution:
                this._getRiskiestTroveBeforeRedistribution({ blockTag }),
            totalStakedUniTokens: this._readable.getTotalStakedUniTokens({
                blockTag,
            }),
            remainingStabilityPoolProtocolTokenReward:
                this._readable.getRemainingStabilityPoolProtocolTokenReward({
                    blockTag,
                }),
        };

        if (frontendTag) {
            basePromises.frontend = this._readable.getFrontendStatus(
                frontendTag,
                { blockTag }
            );
        } else {
            basePromises.frontend = Promise.resolve({
                status: 'unregistered' as const,
            });
        }

        if (userAddress) {
            basePromises.accountBalance = this._provider
                .getBalance(userAddress, blockTag)
                .then(decimalify);
            basePromises.debtTokenBalance = this._readable.getDebtTokenBalance(
                userAddress,
                { blockTag }
            );
            basePromises.protocolTokenBalance =
                this._readable.getProtocolTokenBalance(userAddress, {
                    blockTag,
                });
            basePromises.uniTokenBalance = this._readable.getUniTokenBalance(
                userAddress,
                { blockTag }
            );
            basePromises.uniTokenAllowance =
                this._readable.getUniTokenAllowance(userAddress, { blockTag });
            basePromises.liquidityMiningStake =
                this._readable.getLiquidityMiningStake(userAddress, {
                    blockTag,
                });
            basePromises.liquidityMiningProtocolTokenReward =
                this._readable.getLiquidityMiningProtocolTokenReward(
                    userAddress,
                    { blockTag }
                );
            basePromises.collateralSurplusBalance =
                this._readable.getCollateralSurplusBalance(userAddress, {
                    blockTag,
                });
            basePromises.troveBeforeRedistribution =
                this._readable.getTroveBeforeRedistribution(userAddress, {
                    blockTag,
                });
            basePromises.stabilityDeposit = this._readable.getStabilityDeposit(
                userAddress,
                { blockTag }
            );
            basePromises.protocolTokenStake =
                this._readable.getProtocolTokenStake(userAddress, { blockTag });
            basePromises.ownFrontend = this._readable.getFrontendStatus(
                userAddress,
                { blockTag }
            );
            basePromises.debtInFront = this._readable.getDebtInFront(
                userAddress,
                500,
                { blockTag }
            );
        } else {
            basePromises.accountBalance = Promise.resolve(Decimal.ZERO);
            basePromises.debtTokenBalance = Promise.resolve(Decimal.ZERO);
            basePromises.protocolTokenBalance = Promise.resolve(Decimal.ZERO);
            basePromises.uniTokenBalance = Promise.resolve(Decimal.ZERO);
            basePromises.uniTokenAllowance = Promise.resolve(Decimal.ZERO);
            basePromises.liquidityMiningStake = Promise.resolve(Decimal.ZERO);
            basePromises.liquidityMiningProtocolTokenReward = Promise.resolve(
                Decimal.ZERO
            );
            basePromises.collateralSurplusBalance = Promise.resolve(
                Decimal.ZERO
            );
            basePromises.troveBeforeRedistribution = Promise.resolve(
                new TroveWithPendingRedistribution(AddressZero, 'nonExistent')
            );
            basePromises.stabilityDeposit = Promise.resolve(
                new StabilityDeposit(
                    Decimal.ZERO,
                    Decimal.ZERO,
                    Decimal.ZERO,
                    Decimal.ZERO,
                    AddressZero
                )
            );
            basePromises.protocolTokenStake = Promise.resolve(
                new ProtocolTokenStake()
            );
            basePromises.ownFrontend = Promise.resolve({
                status: 'unregistered' as const,
            });
            basePromises.debtInFront = Promise.resolve([
                Decimal.ZERO,
                AddressZero,
            ] as [debt: Decimal, next: string]);
        }

        const resolvedValues = await promiseAllValues(basePromises);

        const blockTimestamp = resolvedValues.blockTimestamp;
        const _feesFactory = resolvedValues._feesFactory;
        const calculateRemainingProtocolToken =
            resolvedValues.calculateRemainingProtocolToken;

        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            blockTimestamp: _bt,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            _feesFactory: _ff,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            calculateRemainingProtocolToken: _crpt,
            ...baseState
        } = resolvedValues;

        const completeBaseState = {
            ...baseState,
            _feesInNormalMode: (
                _feesFactory as (
                    blockTimestamp: number,
                    recoveryMode: boolean
                ) => Fees
            )(blockTimestamp as number, false),
            remainingProtocolMiningProtocolTokenReward: (
                calculateRemainingProtocolToken as (
                    blockTimestamp: number
                ) => Decimal
            )(blockTimestamp as number),
        } as SfStablecoinStoreBaseState;

        return [
            completeBaseState,
            {
                blockTag,
                blockTimestamp: blockTimestamp as number,
                _feesFactory: _feesFactory as (
                    blockTimestamp: number,
                    recoveryMode: boolean
                ) => Fees,
            },
        ];
    }

    /**
     * Subscribe to contract events to update the store
     */
    private _subscribeToEvents(): void {
        if (!this._contracts.troveManager || !this._contracts.stabilityPool) {
            // eslint-disable-next-line no-console
            console.warn(
                'Cannot subscribe to events: contracts not initialized'
            );
            return;
        }

        if (this._eventSubscriptions['TroveUpdated']) return;

        this._contracts.troveManager.on(
            'TroveUpdated',
            this._throttledUpdate.bind(this)
        );
        this._contracts.troveManager.on(
            'Redemption',
            this._throttledUpdate.bind(this)
        );
        this._contracts.troveManager.on(
            'LTermsUpdated',
            this._throttledUpdate.bind(this)
        );
        this._contracts.troveManager.on(
            'TroveLiquidated',
            this._throttledUpdate.bind(this)
        );
        this._contracts.troveManager.on(
            'BaseRateUpdated',
            this._throttledUpdate.bind(this)
        );
        this._contracts.troveManager.on(
            'LastFeeOpTimeUpdated',
            this._throttledUpdate.bind(this)
        );
        this._contracts.troveManager.on(
            'TotalStakesUpdated',
            this._throttledUpdate.bind(this)
        );
        this._contracts.troveManager.on(
            'SystemSnapshotsUpdated',
            this._throttledUpdate.bind(this)
        );

        this._contracts.stabilityPool.on(
            'StabilityPoolDebtTokenBalanceUpdated',
            this._throttledUpdate.bind(this)
        );
        this._contracts.stabilityPool.on(
            'StabilityPoolETHBalanceUpdated',
            this._throttledUpdate.bind(this)
        );
        this._contracts.stabilityPool.on(
            'ETHGainWithdrawn',
            this._throttledUpdate.bind(this)
        );
        this._contracts.stabilityPool.on(
            'DepositSnapshotUpdated',
            this._throttledUpdate.bind(this)
        );

        this._contracts.borrowerOperations.on(
            'TroveCreated',
            this._throttledUpdate.bind(this)
        );
        this._contracts.borrowerOperations.on(
            'TroveUpdated',
            this._throttledUpdate.bind(this)
        );

        this._contracts.debtToken.on(
            'Transfer',
            this._throttledUpdate.bind(this)
        );

        this._contracts.protocolToken.on(
            'Transfer',
            this._throttledUpdate.bind(this)
        );

        this._eventSubscriptions = {
            TroveUpdated: true,
            Redemption: true,
            LTermsUpdated: true,
            TroveLiquidated: true,
            BaseRateUpdated: true,
            LastFeeOpTimeUpdated: true,
            TotalStakesUpdated: true,
            SystemSnapshotsUpdated: true,
            StabilityPoolDebtTokenBalanceUpdated: true,
            StabilityPoolETHBalanceUpdated: true,
            ETHGainWithdrawn: true,
            DepositSnapshotUpdated: true,
            TroveCreated: true,
            Transfer: true,
        };
    }

    /**
     * Throttle updates to prevent excessive RPC calls
     */
    private _throttledUpdate(): void {
        const now = Date.now();

        if (this._pendingUpdate) return;

        if (now - this._lastUpdateTime < this._updateThrottleMs) {
            this._pendingUpdate = true;
            setTimeout(() => {
                this._pendingUpdate = false;
                this._lastUpdateTime = Date.now();
                this._updateState();
            }, this._updateThrottleMs - (now - this._lastUpdateTime));
        } else {
            this._lastUpdateTime = now;
            this._updateState();
        }
    }

    /**
     * Update the store state based on the latest blockchain data
     */
    private async _updateState(): Promise<void> {
        try {
            const blockTag = await this._provider.getBlockNumber();
            const state = await this._get(blockTag);

            if (this._loaded) {
                this._update(...state);
            } else {
                this._load(...state);
            }
        } catch (error) {
            console.error('Failed to update state:', error);
        }
    }

    /** @internal @override */
    protected _doStart(): () => void {
        this._get().then(state => {
            if (!this._loaded) {
                this._load(...state);
            }
        });

        if (this._wsProvider && !this._fallbackToPolling) {
            this._initializeContracts().then(() => {
                this._subscribeToEvents();
            });

            this._wsProvider.on('error', error => {
                console.error('WebSocket error:', error);
                // eslint-disable-next-line no-console
            });

            this._wsProvider.on('close', () => {
                // eslint-disable-next-line no-console
                console.log('WebSocket connection closed');
            });
        }

        const blockListener = async (_blockTag: number) => {
            const now = Date.now();
            if (
                this._fallbackToPolling ||
                now - this._lastUpdateTime >= 30000
            ) {
                this._lastUpdateTime = now;
                await this._updateState();
            }
        };

        this._provider.on('block', blockListener);

        return () => {
            this._provider.off('block', blockListener);

            if (this._wsProvider) {
                Object.keys(this._contracts).forEach(contractName => {
                    const contract = this._contracts[contractName];
                    if (contract) {
                        contract.removeAllListeners();
                    }
                });

                if (this._wsProvider) {
                    this._wsProvider.cleanUp();
                }
            }

            this._eventSubscriptions = {};
        };
    }

    /** @internal @override */
    protected _reduceExtra(
        oldState: EventDrivenSfStablecoinStoreExtraState,
        stateUpdate: Partial<EventDrivenSfStablecoinStoreExtraState>
    ): EventDrivenSfStablecoinStoreExtraState {
        return {
            blockTag: stateUpdate.blockTag ?? oldState.blockTag,
            blockTimestamp:
                stateUpdate.blockTimestamp ?? oldState.blockTimestamp,
            _feesFactory: stateUpdate._feesFactory ?? oldState._feesFactory,
        };
    }
}
