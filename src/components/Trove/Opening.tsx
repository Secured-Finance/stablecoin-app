/** @jsxImportSource theme-ui */
import {
    Decimal,
    LIQUIDATION_RESERVE,
    MINIMUM_NET_DEBT,
    Percent,
    SfStablecoinStoreState,
    Trove,
} from '@secured-finance/stablecoin-lib-base';
import React, { useState } from 'react';
import { Button } from 'src/components/atoms';
import { TokenBox } from 'src/components/molecules/TokenBox/TokenBox';
import { USDFCIcon, USDFCIconLarge } from 'src/components/SecuredFinanceLogo';
import { useSfStablecoinSelector, useStableTroveChange } from 'src/hooks';
import { Spinner } from 'theme-ui';
import { useAccount } from 'wagmi';
import { CURRENCY } from '../../strings';
import { GasEstimationState } from './ExpensiveTroveChangeWarning';
import { TroveAction } from './TroveAction';
import {
    selectForTroveChangeValidation,
    validateTroveChange,
} from './validation/validateTroveChange';

import { useWeb3Modal } from '@web3modal/wagmi/react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { StatCard } from 'src/components/molecules/StatCard';
import { openDocumentation } from 'src/constants';

const selector = (state: SfStablecoinStoreState) => {
    const { fees, price, accountBalance } = state;
    return {
        fees,
        price,
        accountBalance,
        validationContext: selectForTroveChangeValidation(state),
    };
};

const EMPTY_TROVE = new Trove(Decimal.ZERO, Decimal.ZERO);
const GAS_ROOM_ETH = Decimal.from(0.1);

export const Opening: React.FC = () => {
    const { isConnected } = useAccount();
    const { open } = useWeb3Modal();
    const { fees, price, accountBalance, validationContext } =
        useSfStablecoinSelector(selector);
    const borrowingRate = fees.borrowingRate();

    const [collateralInput, setCollateralInput] = useState('');
    const [borrowAmountInput, setBorrowAmountInput] = useState('');
    const [borrowEditedManually, setBorrowEditedManually] = useState(false);

    // Parse inputs to decimals safely
    const collateral = (() => {
        try {
            const cleanValue = collateralInput?.replace(/,/g, '') || '0';
            return cleanValue && cleanValue !== ''
                ? Decimal.from(cleanValue)
                : Decimal.ZERO;
        } catch {
            return Decimal.ZERO;
        }
    })();

    const borrowAmount = (() => {
        try {
            const cleanValue = borrowAmountInput?.replace(/,/g, '') || '0';
            return cleanValue && cleanValue !== ''
                ? Decimal.from(cleanValue)
                : Decimal.ZERO;
        } catch {
            return Decimal.ZERO;
        }
    })();

    const maxBorrowingRate = borrowingRate.add(0.005);

    const fee = borrowAmount.mul(borrowingRate);
    const feePct = new Percent(borrowingRate);
    const totalDebt = borrowAmount.add(LIQUIDATION_RESERVE).add(fee);
    const isDirty = !collateral.isZero || !borrowAmount.isZero;
    const trove = isDirty ? new Trove(collateral, totalDebt) : EMPTY_TROVE;
    const maxCollateral = accountBalance.gt(GAS_ROOM_ETH)
        ? accountBalance.sub(GAS_ROOM_ETH)
        : Decimal.ZERO;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const collateralMaxedOut = collateral.eq(maxCollateral);
    const collateralRatio =
        !collateral.isZero && !borrowAmount.isZero
            ? trove.collateralRatio(price)
            : undefined;

    // Calculate liquidation risk based on collateral ratio
    const getLiquidationRisk = (ratio?: Decimal) => {
        if (!ratio)
            return {
                text: 'Low',
                color: 'text-success-700',
                bg: 'bg-success-500',
            };
        const ratioPercent = ratio.mul(100);
        if (ratioPercent.gte(200))
            return {
                text: 'Very Low',
                color: 'text-success-700',
                bg: 'bg-success-500',
            };
        if (ratioPercent.gte(150))
            return {
                text: 'Low',
                color: 'text-success-700',
                bg: 'bg-success-500',
            };
        if (ratioPercent.gte(120))
            return {
                text: 'Medium',
                color: 'text-warning-700',
                bg: 'bg-warning-500',
            };
        return { text: 'High', color: 'text-error-700', bg: 'bg-error-500' };
    };

    const liquidationRisk = getLiquidationRisk(collateralRatio);

    const [troveChange, description] = validateTroveChange(
        EMPTY_TROVE,
        trove,
        borrowingRate,
        validationContext
    );

    const stableTroveChange = useStableTroveChange(troveChange);
    const [gasEstimationState] = useState<GasEstimationState>({ type: 'idle' });

    const TRANSACTION_ID = 'trove-creation';

    return (
        <div className='w-full flex-col items-center'>
            <TokenBox
                inputLabel='Collateral'
                inputValue={collateralInput}
                autoFocusInput={true}
                onInputChange={value => {
                    setCollateralInput(value);
                }}
                onInputBlur={() => {
                    // Handle negative values by setting to 0
                    if (collateral.lt(Decimal.ZERO)) {
                        setCollateralInput('0');
                        return;
                    }

                    // If user hasn't manually edited borrow amount, compute a recommended value
                    if (
                        !borrowEditedManually ||
                        !borrowAmountInput ||
                        borrowAmountInput === '' ||
                        borrowAmount.isZero
                    ) {
                        if (!collateral.isZero) {
                            const stableDebt = collateral
                                .mul(price)
                                .mulDiv(2, 3);
                            const allowedDebt = stableDebt.gt(
                                LIQUIDATION_RESERVE
                            )
                                ? stableDebt
                                      .sub(LIQUIDATION_RESERVE)
                                      .div(Decimal.ONE.add(borrowingRate))
                                : Decimal.ZERO;
                            const finalDebt = allowedDebt.gt(MINIMUM_NET_DEBT)
                                ? allowedDebt
                                : MINIMUM_NET_DEBT;
                            setBorrowAmountInput(finalDebt.prettify());
                        }
                    }
                }}
                inputTokenIcon={
                    <>
                        <FILIcon className='h-8 w-8' />
                        <span className='text-2xl font-medium leading-none text-neutral-900'>
                            {CURRENCY}
                        </span>
                    </>
                }
                inputSubLabel={`$${collateral.mul(price).prettify()}`}
                outputLabel='You will borrow'
                outputValue={borrowAmountInput}
                onOutputChange={value => {
                    setBorrowEditedManually(true);
                    setBorrowAmountInput(value);
                }}
                onOutputBlur={() => {
                    // Handle negative values by setting to 0
                    if (borrowAmount.lt(Decimal.ZERO)) {
                        setBorrowAmountInput('0');
                    }
                }}
                outputTokenIcon={
                    <>
                        <USDFCIconLarge />
                        <span className='text-2xl font-medium leading-none text-neutral-900'>
                            USDFC
                        </span>
                    </>
                }
                outputSubLabel={`$${borrowAmount.prettify()}`}
                isConnected={isConnected}
                maxValue={maxCollateral.prettify()}
                onMaxClick={() => {
                    setCollateralInput(maxCollateral.prettify());
                    // On explicit Max, recompute recommended borrow amount only if user hasn't edited manually
                    if (!borrowEditedManually) {
                        if (!maxCollateral.isZero) {
                            const stableDebt = maxCollateral
                                .mul(price)
                                .mulDiv(2, 3);
                            const allowedDebt = stableDebt.gt(
                                LIQUIDATION_RESERVE
                            )
                                ? stableDebt
                                      .sub(LIQUIDATION_RESERVE)
                                      .div(Decimal.ONE.add(borrowingRate))
                                : Decimal.ZERO;
                            const finalDebt = allowedDebt.gt(MINIMUM_NET_DEBT)
                                ? allowedDebt
                                : MINIMUM_NET_DEBT;
                            setBorrowAmountInput(finalDebt.prettify());
                        }
                    }
                }}
            />

            <div className='mb-6 mt-8'>{description}</div>

            <div className='mb-6 mt-6 space-y-4'>
                <StatCard
                    title='Collateral Ratio'
                    description='The ratio of deposited FIL to borrowed USDFC. If it falls below 110% (or 150% in Recovery Mode), liquidation may occur.'
                    value={
                        <p className='text-right font-bold'>
                            {collateralRatio
                                ? `${collateralRatio.mul(100).prettify()}%`
                                : '150%'}
                        </p>
                    }
                    tooltip={{
                        title: 'Collateral Ratio',
                        description:
                            'The ratio of deposited FIL to borrowed USDFC. It must stay above 110% to avoid liquidation, or 150% if Recovery Mode is triggered.',
                        onButtonClick: () =>
                            openDocumentation('collateralRatio'),
                    }}
                />

                <StatCard
                    title='Liquidation Risk'
                    description='The risk of losing your FIL collateral if your Collateral Ratio drops below 110% under normal conditions or 150% in Recovery Mode.'
                    value={
                        <div className='flex items-center justify-end gap-2'>
                            <div
                                className={`h-3 w-3 rounded-full ${liquidationRisk.bg}`}
                            ></div>
                            <span
                                className={`font-medium ${liquidationRisk.color}`}
                            >
                                {liquidationRisk.text}
                            </span>
                        </div>
                    }
                    tooltip={{
                        title: 'Liquidation Risk',
                        description:
                            'The risk of losing your FIL collateral if your Collateral Ratio drops below 110% under normal conditions or 150% in Recovery Mode.',
                        onButtonClick: () =>
                            openDocumentation('liquidationMechanics'),
                    }}
                />

                <StatCard
                    title='Liquidation Reserve'
                    description="An amount added to your debt to cover liquidator gas costs in case your Trove is liquidated. It's refunded if you fully repay your debt and close your Trove."
                    value={
                        <div className='flex items-center justify-end gap-1'>
                            <span className='font-bold'>
                                {LIQUIDATION_RESERVE.toString()}
                            </span>
                            <USDFCIcon />
                            <span>USDFC</span>
                        </div>
                    }
                    tooltip={{
                        title: 'Liquidation Reserve',
                        description:
                            'A small deposit set aside when opening a trove. It ensures funds are available for liquidation costs and is refunded upon full repayment.',
                        onButtonClick: () =>
                            openDocumentation('liquidationReserve'),
                    }}
                />

                <StatCard
                    title='Borrowing Fee'
                    description={`A one-time ${feePct.prettify()} fee charged when borrowing USDFC, added to the loan balance.`}
                    value={
                        <div className='flex flex-col items-end tablet:flex-row tablet:items-center tablet:justify-end tablet:gap-1'>
                            <div className='flex items-center gap-1'>
                                <span className='font-bold'>
                                    {fee.prettify()}
                                </span>
                                <USDFCIcon />
                                <span>USDFC</span>
                            </div>
                            <span className='text-sm font-normal text-neutral-450'>
                                {feePct.prettify()}
                            </span>
                        </div>
                    }
                    tooltip={{
                        title: 'Borrowing Fee',
                        description:
                            'A one-time fee charged when borrowing USDFC, calculated as a percentage of the loan amount. It varies based on system conditions and helps maintain protocol stability.',
                        onButtonClick: () => openDocumentation('borrowingFee'),
                    }}
                />
            </div>

            <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-6'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-bold'>Total Debt</h3>
                    <div className='flex items-center gap-1'>
                        <span className='font-bold'>
                            {totalDebt.prettify()}
                        </span>
                        <USDFCIcon />

                        <span>USDFC</span>
                    </div>
                </div>
            </div>

            {isConnected ? (
                gasEstimationState.type === 'inProgress' ? (
                    <Button
                        disabled
                        className='text-lg w-full bg-primary-500 py-4'
                    >
                        <Spinner size={24} sx={{ color: 'background' }} />
                    </Button>
                ) : stableTroveChange ? (
                    <TroveAction
                        transactionId={TRANSACTION_ID}
                        change={stableTroveChange}
                        maxBorrowingRate={maxBorrowingRate}
                        borrowingFeeDecayToleranceMinutes={60}
                        className='mb-3 w-full rounded-xl bg-primary-500 py-3.5 font-medium text-white hover:bg-primary-500/90'
                    >
                        Confirm
                    </TroveAction>
                ) : (
                    <Button
                        disabled
                        className='mb-3 w-full rounded-xl bg-primary-500 py-3.5 font-medium text-white'
                    >
                        Update Trove
                    </Button>
                )
            ) : (
                <Button
                    className='mb-3 w-full rounded-xl bg-primary-500 py-3.5 font-medium text-white hover:bg-primary-500/90'
                    onClick={() => open()}
                >
                    Connect wallet
                </Button>
            )}

            <p className='mt-2 text-center text-sm text-neutral-450'>
                This action will open your wallet to sign the transaction.
            </p>
        </div>
    );
};
