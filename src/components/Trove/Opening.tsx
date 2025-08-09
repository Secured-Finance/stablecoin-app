/** @jsxImportSource theme-ui */
import {
    Decimal,
    LIQUIDATION_RESERVE,
    MINIMUM_NET_DEBT,
    Percent,
    SfStablecoinStoreState,
    Trove,
} from '@secured-finance/stablecoin-lib-base';
import React, { useEffect, useState } from 'react';
import { Button } from 'src/components/atoms';
import { useSfStablecoinSelector, useStableTroveChange } from 'src/hooks';
import { Spinner } from 'theme-ui';
import { CURRENCY } from '../../strings';
import { GasEstimationState } from './ExpensiveTroveChangeWarning';
import { TroveAction } from './TroveAction';
import {
    selectForTroveChangeValidation,
    validateTroveChange,
} from './validation/validateTroveChange';
import { SecuredFinanceLogo } from '../SecuredFinanceLogo';
import { useAccount } from 'wagmi';
import { ArrowDown } from 'lucide-react';

import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { useWeb3Modal } from '@web3modal/wagmi/react';

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

    const [collateral, setCollateral] = useState<Decimal>(Decimal.ZERO);
    const [borrowAmount, setBorrowAmount] = useState<Decimal>(Decimal.ZERO);

    const [collateralInput, setCollateralInput] = useState('0.00');
    const [borrowAmountInput, setBorrowAmountInput] = useState('0.00');

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

    const [troveChange, description] = validateTroveChange(
        EMPTY_TROVE,
        trove,
        borrowingRate,
        validationContext
    );

    const stableTroveChange = useStableTroveChange(troveChange);
    const [gasEstimationState] = useState<GasEstimationState>({ type: 'idle' });

    const TRANSACTION_ID = 'trove-creation';

    const getSafeBorrowableAmount = (
        collateral: Decimal,
        price: Decimal,
        fee: Decimal
    ): Decimal => {
        try {
            if (price.lte(Decimal.ZERO)) return Decimal.ZERO;
            const raw = collateral.div(price).sub(fee);
            return raw.lt(0) ? Decimal.ZERO : raw;
        } catch {
            return Decimal.ZERO;
        }
    };

    useEffect(() => {
        if (!collateral.isZero) {
            const stableDebt = collateral.mul(price).mulDiv(2, 3);

            const allowedDebt = stableDebt.gt(LIQUIDATION_RESERVE)
                ? stableDebt
                      .sub(LIQUIDATION_RESERVE)
                      .div(Decimal.ONE.add(borrowingRate))
                : Decimal.ZERO;

            const finalDebt = allowedDebt.gt(MINIMUM_NET_DEBT)
                ? allowedDebt
                : MINIMUM_NET_DEBT;

            setBorrowAmount(finalDebt);
            setBorrowAmountInput(finalDebt.prettify());
        }
    }, [borrowingRate, collateral, price]);

    return (
        <>
            <div className='flex w-full flex-col items-center'>
                <div className='flex w-full  items-center justify-between space-y-4 rounded-xl border border-[#e3e3e3] bg-white p-6 '>
                    <div className='flex-1'>
                        <p className='mb-1 text-sm font-medium text-[#001C33]'>
                            Collateral
                        </p>
                        <input
                            type='number'
                            className='w-full bg-transparent text-[36px] font-semibold leading-tight text-[#001C33] outline-none'
                            inputMode='decimal'
                            value={collateralInput}
                            onChange={e => {
                                const value = e.target.value;
                                if (value.trim() === '') {
                                    setCollateral(Decimal.ZERO);
                                    return;
                                }
                                setCollateralInput(value);
                                const parsed = Decimal.from(value);
                                if (parsed) setCollateral(parsed);
                            }}
                            onBlur={() => {
                                setCollateralInput(collateral.prettify());
                            }}
                        />
                        <p className='mt-1 text-sm text-[#8E8E93]'>
                            {getSafeBorrowableAmount(
                                collateral,
                                price,
                                fee
                            ).prettify()}
                        </p>
                    </div>
                    <div className='ml-4 flex items-center gap-2 rounded-full border border-[#E5E5EA] bg-[#F5F5F5] px-3 py-1'>
                        <FILIcon />
                        <span className='text-base font-semibold text-[#001C33]'>
                            {CURRENCY}
                        </span>
                    </div>
                </div>
                <div className='relative z-10 -my-7 flex items-center justify-center'>
                    <div className='shadow-md flex h-16 w-16 items-center justify-center rounded-xl border border-[#e3e3e3] bg-white'>
                        <ArrowDown className='h-8 w-8 text-[#001C33]' />
                    </div>
                </div>
                <div className='mb-4 flex  w-full items-center justify-between space-y-4 rounded-xl border border-[#e3e3e3] bg-white p-6'>
                    <div className='flex-1'>
                        <p className='mb-1 text-sm font-medium text-[#001C33]'>
                            You will borrow
                        </p>
                        <input
                            type='number'
                            className='w-full bg-transparent text-[36px] font-semibold leading-tight text-[#001C33] outline-none'
                            value={borrowAmountInput}
                            onChange={e => {
                                const val = e.target.value;
                                setBorrowAmountInput(val);
                                const parsed = Decimal.from(val);
                                if (parsed) setBorrowAmount(parsed);
                            }}
                            onBlur={() => {
                                setBorrowAmountInput(borrowAmount.prettify());
                            }}
                        />
                        <p className='mt-1 text-sm text-[#8E8E93]'>
                            {fee.prettify(2)}
                        </p>
                    </div>
                    <div className='ml-4 flex items-center gap-2 rounded-full border border-[#E5E5EA] bg-[#F5F5F5] px-3 py-1'>
                        <SecuredFinanceLogo />
                    </div>
                </div>
            </div>

            <span>{description}</span>

            <div className='mb-6 mt-6 space-y-4'>
                <div className='rounded-xl border border-[#e3e3e3] bg-white p-6'>
                    <div className='flex items-start justify-between'>
                        <div className='max-w-[60%] text-sm text-[#565656]'>
                            The ratio of deposited FIL to borrowed USDFC. If it
                            falls below 110% (or 150% in Recovery Mode),
                            liquidation may occur.
                        </div>
                        <div>
                            <h3 className='mb-1 text-right text-sm text-[#565656]'>
                                Collateral Ratio
                            </h3>
                            <p className='text-right font-bold'>
                                {collateralRatio?.mul(100)?.prettify()}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className='rounded-xl border border-[#e3e3e3] bg-white p-6'>
                    <div className='flex items-start justify-between'>
                        <div className='max-w-[60%] text-sm text-[#565656]'>
                            The risk of losing your FIL collateral if your
                            Collateral Ratio drops below 110% under normal
                            conditions or 150% in Recovery Mode.
                        </div>
                        <div>
                            <h3 className='mb-1 text-right text-sm text-[#565656]'>
                                Liquidation Risk
                            </h3>
                            <div className='flex items-center justify-end gap-2'>
                                <div className='h-3 w-3 rounded-full bg-green-500'></div>
                                <span className='font-medium text-green-700'>
                                    Low
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='rounded-xl border border-[#e3e3e3] bg-white p-6'>
                    <div className='flex items-start justify-between'>
                        <div className='max-w-[60%] text-sm text-[#565656]'>
                            An amount added to your debt to cover liquidator gas
                            costs in case your Trove is liquidated. It&apos;s
                            refunded if you fully repay your debt and close your
                            Trove.
                        </div>
                        <div>
                            <h3 className='mb-1 text-right text-sm text-[#565656]'>
                                Liquidation Reserve
                            </h3>
                            <div className='flex items-center justify-end gap-1'>
                                <span className='font-bold'>
                                    {LIQUIDATION_RESERVE.toString()}
                                </span>
                                <SecuredFinanceLogo />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='rounded-xl border border-[#e3e3e3] bg-white p-6'>
                    <div className='flex items-start justify-between'>
                        <div className='max-w-[60%] text-sm text-[#565656]'>
                            A one-time 0.5% fee charged when borrowing USDFC,
                            added to the loan balance.
                        </div>
                        <div>
                            <h3 className='mb-1 text-right text-sm text-[#565656]'>
                                Borrowing Fee
                            </h3>
                            <div className='flex items-center justify-end gap-1'>
                                <span className='font-bold'>
                                    {fee.prettify()}
                                </span>
                                <SecuredFinanceLogo />

                                <span className='ml-1 text-sm font-normal text-[#565656]'>
                                    {feePct.prettify()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-bold'>Total Debt</h3>
                    <div className='flex items-center gap-1'>
                        <span className='font-bold'>
                            {totalDebt.prettify()}
                        </span>
                        <SecuredFinanceLogo />
                    </div>
                </div>
            </div>

            {isConnected ? (
                gasEstimationState.type === 'inProgress' ? (
                    <Button
                        disabled
                        className='text-lg w-full bg-[#1a30ff] py-4'
                    >
                        <Spinner size={24} sx={{ color: 'background' }} />
                    </Button>
                ) : stableTroveChange ? (
                    <TroveAction
                        transactionId={TRANSACTION_ID}
                        change={stableTroveChange}
                        maxBorrowingRate={maxBorrowingRate}
                        borrowingFeeDecayToleranceMinutes={60}
                    >
                        Confirm
                    </TroveAction>
                ) : (
                    <Button
                        disabled
                        className='text-lg w-full bg-[#1a30ff] py-4'
                    >
                        Update Trove
                    </Button>
                )
            ) : (
                <Button
                    className='mb-3 w-full rounded-xl bg-[#1a30ff] py-3.5 font-medium text-white hover:bg-[#1a30ff]/90'
                    onClick={() => open()}
                >
                    Connect wallet
                </Button>
            )}

            <p className='mt-2 text-center text-sm text-[#565656]'>
                This action will open your wallet to sign the transaction.
            </p>
        </>
    );
};
