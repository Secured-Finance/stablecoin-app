import { useEffect, useState } from 'react';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { useAccount } from 'wagmi';
import { Button } from '../atoms';
import { SecuredFinanceLogo } from '../SecuredFinanceLogo';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import {
    Decimal,
    LIQUIDATION_RESERVE,
    MINIMUM_NET_DEBT,
    SfStablecoinStoreState,
    Trove,
} from '@secured-finance/stablecoin-lib-base';
import { useSfStablecoinSelector } from 'src/hooks';
import { DEBT_TOKEN_PRECISION } from 'src/utils';

export const TrovePage = () => {
    const { isConnected } = useAccount();
    const [debt, setDebt] = useState('975.51');
    const [isClosing, setIsClosing] = useState(false);
    const [activeTab, setActiveTab] = useState('create');

    const { open } = useWeb3Modal();

    const collateralUsdValue = '$1463.26';
    const debtValue = '$975.51';
    const liquidationRisk = 'Low';
    const maxDebt = 1500;
    const liquidationPrice = '$3.94';

    const handleMaxCollateral = () => {};

    const handleMaxDebt = () => {
        setDebt(maxDebt.toString());
    };

    const select = ({
        numberOfTroves,
        price,
        total,
        debtTokenInStabilityPool,
        borrowingRate,
        redemptionRate,
        totalStakedProtocolToken,
        frontend,
        fees,
    }: SfStablecoinStoreState) => ({
        numberOfTroves,
        price,
        total,
        debtTokenInStabilityPool,
        borrowingRate,
        redemptionRate,
        totalStakedProtocolToken,
        kickbackRate:
            frontend.status === 'registered' ? frontend.kickbackRate : null,
        fees,
    });
    const data = useSfStablecoinSelector(select);

    const currentFilPrice = data.price.toString(2);

    const borrowingRate = data.fees.borrowingRate();
    const borrowRate = borrowingRate.prettify(4);

    const [collateral] = useState<Decimal>(Decimal.ZERO);
    const [borrowAmount, setBorrowAmount] = useState<Decimal>(Decimal.ZERO);
    const fee = borrowAmount.mul(borrowingRate);

    const EMPTY_TROVE = new Trove(Decimal.ZERO, Decimal.ZERO);
    const totalDebt = borrowAmount.add(LIQUIDATION_RESERVE).add(fee);
    const isDirty = !collateral.isZero || !borrowAmount.isZero;
    const trove = isDirty ? new Trove(collateral, totalDebt) : EMPTY_TROVE;
    const collateralRatio =
        !collateral.isZero && !borrowAmount.isZero
            ? trove.collateralRatio(data.price)
            : undefined;

    useEffect(() => {
        if (!collateral.isZero) {
            const stableDebt = collateral.mul(data.price).mulDiv(2, 3); // for 150% CR

            const allowedDebt = stableDebt.gt(LIQUIDATION_RESERVE)
                ? stableDebt
                      .sub(LIQUIDATION_RESERVE)
                      .div(Decimal.ONE.add(borrowRate))
                : Decimal.ZERO;

            setBorrowAmount(
                allowedDebt.gt(MINIMUM_NET_DEBT)
                    ? allowedDebt
                    : MINIMUM_NET_DEBT
            );
        }
    }, [borrowRate, collateral, data.price]);

    return (
        <div className='min-h-[100vh] w-full'>
            <main className='container mx-auto px-4 py-10'>
                <h1 className='text-3xl mb-8 font-bold'>Trove</h1>
                <>
                    {activeTab === 'create' && (
                        <>
                            <div className='mb-6 rounded-2xl border border-[#e3e3e3] bg-[#FAFAFA] p-6'>
                                <div className='mb-4 flex items-center justify-between'>
                                    <div>
                                        <p className='mb-1 text-[14px] font-medium text-[#001C33]'>
                                            Collateral
                                        </p>
                                        <p className='text-[36px] font-semibold leading-tight text-[#001C33]'>
                                            {collateral.toString()}
                                        </p>
                                        <p className='text-[14px] text-[#8E8E93]'>
                                            {collateralUsdValue}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-2 rounded-full border border-[#E5E5EA] bg-[#F5F5F5] px-3 py-1'>
                                        <FILIcon />
                                        <span className='text-[16px] font-semibold text-[#001C33]'>
                                            FIL
                                        </span>
                                    </div>
                                </div>

                                <div className='my-2 flex justify-center'>
                                    <div className='flex h-8 w-8 items-center justify-center rounded-full border border-[#e3e3e3] bg-[#F5F5F5]'>
                                        <svg
                                            width='12'
                                            height='12'
                                            viewBox='0 0 12 12'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                d='M6 1V11M6 11L10 7M6 11L2 7'
                                                stroke='#001C33'
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Borrow Display */}
                                <div className='mt-4 flex items-center justify-between'>
                                    <div>
                                        <p className='mb-1 text-[14px] font-medium text-[#001C33]'>
                                            You will borrow
                                        </p>
                                        <p className='text-[36px] font-semibold leading-tight text-[#001C33]'>
                                            {debt}
                                        </p>
                                        <p className='text-[14px] text-[#8E8E93]'>
                                            {debtValue}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-2 rounded-full border border-[#E5E5EA] bg-[#F5F5F5] px-3 py-1'>
                                        <SecuredFinanceLogo />
                                    </div>
                                </div>
                            </div>

                            <div className='mb-6 space-y-4'>
                                <div className='rounded-xl border border-[#e3e3e3] bg-white p-6'>
                                    <div className='flex items-start justify-between'>
                                        <div className='max-w-[60%] text-sm text-[#565656]'>
                                            The ratio of deposited FIL to
                                            borrowed USDFC. If it falls below
                                            110% (or 150% in Recovery Mode),
                                            liquidation may occur.
                                        </div>
                                        <div>
                                            <h3 className='mb-1 text-right text-sm text-[#565656]'>
                                                Collateral Ratio
                                            </h3>
                                            <p className='text-right font-bold'>
                                                {collateralRatio?.prettify(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='rounded-xl border border-[#e3e3e3] bg-white p-6'>
                                    <div className='flex items-start justify-between'>
                                        <div className='max-w-[60%] text-sm text-[#565656]'>
                                            The risk of losing your FIL
                                            collateral if your Collateral Ratio
                                            drops below 110% under normal
                                            conditions or 150% in Recovery Mode.
                                        </div>
                                        <div>
                                            <h3 className='mb-1 text-right text-sm text-[#565656]'>
                                                Liquidation Risk
                                            </h3>
                                            <div className='flex items-center justify-end gap-2'>
                                                <div className='h-3 w-3 rounded-full bg-green-500'></div>
                                                <span className='font-medium text-green-700'>
                                                    {liquidationRisk}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='rounded-xl border border-[#e3e3e3] bg-white p-6'>
                                    <div className='flex items-start justify-between'>
                                        <div className='max-w-[60%] text-sm text-[#565656]'>
                                            The FIL price at which your Trove
                                            would be liquidated. Keep an eye on
                                            this price to manage your risk.
                                        </div>
                                        <div>
                                            <h3 className='mb-1 text-right text-sm text-[#565656]'>
                                                Liquidation Price
                                            </h3>
                                            <p className='text-right font-bold'>
                                                {liquidationPrice}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='rounded-xl border border-[#e3e3e3] bg-white p-6'>
                                    <div className='flex items-start justify-between'>
                                        <div className='max-w-[60%] text-sm text-[#565656]'>
                                            The current market price of FIL.
                                            This helps you understand your
                                            position relative to the liquidation
                                            price.
                                        </div>
                                        <div>
                                            <h3 className='mb-1 text-right text-sm text-[#565656]'>
                                                Current FIL Price
                                            </h3>
                                            <p className='text-right font-bold'>
                                                {currentFilPrice}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='rounded-xl border border-[#e3e3e3] bg-white p-6'>
                                    <div className='flex items-start justify-between'>
                                        <div className='max-w-[60%] text-sm text-[#565656]'>
                                            An amount added to your debt to
                                            cover liquidator gas costs in case
                                            your Trove is liquidated. It&apos;s
                                            refunded if you fully repay your
                                            debt and close your Trove.
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
                                            A one-time 0.5% fee charged when
                                            borrowing USDFC, added to the loan
                                            balance.
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
                                                    0.5%
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
                                            {totalDebt.toString()}
                                        </span>
                                        <SecuredFinanceLogo />
                                    </div>
                                </div>
                            </div>

                            <Button
                                className='text-lg w-full bg-[#1a30ff] py-4 hover:bg-[#0f1b99]'
                                onClick={() => {
                                    if (isConnected) {
                                        setActiveTab('manage');
                                    } else {
                                        open();
                                    }
                                }}
                            >
                                {isConnected
                                    ? ' Create Trove and Borrow USDFC'
                                    : 'Connect wallet'}
                            </Button>

                            <p className='mt-2 text-center text-sm text-[#565656]'>
                                This action will open your wallet to sign the
                                transaction.
                            </p>
                        </>
                    )}

                    {activeTab === 'manage' && (
                        <>
                            <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
                                <h3 className='text-xl mb-4 font-medium'>
                                    Your Trove
                                </h3>
                                <div className='grid grid-cols-2 gap-6'>
                                    <div>
                                        <p className='mb-1 text-sm text-[#565656]'>
                                            Total Debt
                                        </p>
                                        <div className='flex items-center gap-1'>
                                            <span className='font-bold'>
                                                {totalDebt.toString()}
                                            </span>
                                            <SecuredFinanceLogo />
                                        </div>
                                    </div>
                                    <div>
                                        <p className='mb-1 text-sm text-[#565656]'>
                                            Collateral
                                        </p>
                                        <div className='flex items-center gap-1'>
                                            <span className='font-bold'>
                                                240.3
                                            </span>
                                            <FILIcon />
                                            <span className='text-sm'>FIL</span>
                                            <span className='ml-1 text-xs text-[#565656]'>
                                                $0.34
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='mb-1 text-sm text-[#565656]'>
                                            Collateral Ratio
                                        </p>
                                        <div className='flex items-center gap-1'>
                                            <span className='font-bold'>
                                                150.9%
                                            </span>
                                            <div className='ml-2 flex items-center gap-1'>
                                                <div className='h-2 w-2 rounded-full bg-green-500'></div>
                                                <span className='text-xs text-green-700'>
                                                    Low Liquidation Risk
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='mb-1 text-sm text-[#565656]'>
                                            Debt in Front
                                        </p>
                                        <div className='font-bold'>$41.8M</div>
                                    </div>
                                </div>
                            </div>

                            <div className='mb-6 flex gap-4'>
                                <Button
                                    // variant='outline'
                                    className={`w-full ${
                                        isClosing
                                            ? ''
                                            : 'border-[#1a30ff] bg-[#f5f5ff] text-[#1a30ff]'
                                    }`}
                                    onClick={() => setIsClosing(false)}
                                >
                                    Update Trove
                                </Button>
                                <Button
                                    className={`w-full ${
                                        isClosing
                                            ? 'border-[#1a30ff] bg-[#f5f5ff] text-[#1a30ff]'
                                            : ''
                                    }`}
                                    onClick={() => setIsClosing(true)}
                                >
                                    Close Trove
                                </Button>
                            </div>

                            {!isClosing ? (
                                <>
                                    <p className='mb-6 text-center text-sm text-[#565656]'>
                                        Update your Trove by modifying its
                                        collateral, borrowed amount, or both.
                                    </p>

                                    <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
                                        <div className='mb-6'>
                                            <span className='mb-2 block text-sm font-medium'>
                                                Collateral
                                            </span>
                                            <div className='flex items-center'>
                                                <div className='flex grow'>
                                                    <input
                                                        type='decimal'
                                                        value={collateral.toString()}
                                                        // onChange={e =>
                                                        //     setCollateral(
                                                        //         e.target.value
                                                        //     )
                                                        // }
                                                        className='text-xl h-12 min-w-0 flex-1 rounded-md border border-[#e3e3e3] bg-white px-3 py-2 font-bold'
                                                    />
                                                    <Button
                                                        // variant='outline'
                                                        onClick={
                                                            handleMaxCollateral
                                                        }
                                                        className='ml-2'
                                                    >
                                                        Max
                                                    </Button>
                                                </div>
                                                <div className='ml-4 flex min-w-[90px] items-center justify-end gap-2'>
                                                    <FILIcon />
                                                    <span className='font-medium'>
                                                        FIL
                                                    </span>
                                                </div>
                                            </div>
                                            <p className='mt-1 text-sm text-[#565656]'>
                                                {collateralUsdValue}
                                            </p>
                                        </div>

                                        <div className='mb-6'>
                                            <span className='mb-2 block text-sm font-medium'>
                                                Borrowed Amount
                                            </span>
                                            <div className='flex items-center'>
                                                <div className='flex grow'>
                                                    <input
                                                        type='text'
                                                        value={debt}
                                                        onChange={e =>
                                                            setDebt(
                                                                e.target.value
                                                            )
                                                        }
                                                        className='text-xl h-12 min-w-0 flex-1 rounded-md border border-[#e3e3e3] bg-white px-3 py-2 font-bold'
                                                    />
                                                    <Button
                                                        // variant='outline'
                                                        onClick={handleMaxDebt}
                                                        className='ml-2'
                                                    >
                                                        Max
                                                    </Button>
                                                </div>
                                                <div className='ml-4 flex min-w-[90px] items-center justify-end gap-2'>
                                                    <SecuredFinanceLogo />
                                                </div>
                                            </div>
                                            <p className='mt-1 text-sm text-[#565656]'>
                                                {debtValue}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='mb-6 space-y-4'>
                                        <div className='rounded-xl border border-[#e3e3e3] bg-white p-6'>
                                            <div className='flex items-start justify-between'>
                                                <div className='max-w-[60%] text-sm text-[#565656]'>
                                                    The ratio of deposited FIL
                                                    to borrowed USDFC. If it
                                                    falls below 110% (or 150% in
                                                    Recovery Mode), liquidation
                                                    may occur.
                                                </div>
                                                <div>
                                                    <h3 className='mb-1 text-right text-sm text-[#565656]'>
                                                        New Collateral Ratio
                                                    </h3>
                                                    <p className='text-right font-bold'>
                                                        {collateralRatio?.toString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='rounded-xl border border-[#e3e3e3] bg-white p-6'>
                                            <div className='flex items-start justify-between'>
                                                <div className='max-w-[60%] text-sm text-[#565656]'>
                                                    The risk of losing your FIL
                                                    collateral if your
                                                    Collateral Ratio drops below
                                                    110% under normal conditions
                                                    or 150% in Recovery Mode.
                                                </div>
                                                <div>
                                                    <h3 className='mb-1 text-right text-sm text-[#565656]'>
                                                        New Liquidation Risk
                                                    </h3>
                                                    <div className='flex items-center justify-end gap-2'>
                                                        <div className='h-3 w-3 rounded-full bg-green-500'></div>
                                                        <span className='font-medium text-green-700'>
                                                            {liquidationRisk}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
                                        <div className='flex items-center justify-between'>
                                            <h3 className='font-bold'>
                                                Total Debt
                                            </h3>
                                            <div className='flex items-center gap-1'>
                                                <span className='font-bold'>
                                                    {totalDebt.prettify(
                                                        DEBT_TOKEN_PRECISION
                                                    )}
                                                </span>
                                                <SecuredFinanceLogo />
                                            </div>
                                        </div>
                                    </div>

                                    <Button className='text-lg w-full bg-[#1a30ff] py-4 hover:bg-[#0f1b99]'>
                                        Update Trove
                                    </Button>
                                    <p className='mt-2 text-center text-sm text-[#565656]'>
                                        This action will open your wallet to
                                        sign the transaction.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className='mb-6 text-center text-sm text-[#565656]'>
                                        Closing your Trove will repay all your
                                        debt and return your remaining
                                        collateral.
                                    </p>

                                    <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
                                        <div className='mb-6'>
                                            <span className='mb-2 block text-sm font-medium'>
                                                You will repay
                                            </span>
                                            <div className='flex items-center'>
                                                <input
                                                    type='text'
                                                    value={totalDebt.prettify(
                                                        2
                                                    )}
                                                    readOnly
                                                    className='text-xl h-12 flex-1 rounded-md border border-[#e3e3e3] bg-white px-3 py-2 font-bold'
                                                />
                                                <div className='ml-4 flex items-center gap-2'>
                                                    <SecuredFinanceLogo />
                                                </div>
                                            </div>
                                            <p className='mt-1 text-sm text-[#565656]'>
                                                ${totalDebt.toString()}
                                            </p>
                                        </div>

                                        <div className='mb-6'>
                                            <span className='mb-2 block text-sm font-medium'>
                                                You will reclaim
                                            </span>
                                            <div className='flex items-center'>
                                                <input
                                                    type='text'
                                                    value='331.24'
                                                    readOnly
                                                    className='text-xl h-12 flex-1 rounded-md border border-[#e3e3e3] bg-white px-3 py-2 font-bold'
                                                />
                                                <div className='ml-4 flex items-center gap-2'>
                                                    <FILIcon />
                                                    <span className='font-medium'>
                                                        FIL
                                                    </span>
                                                </div>
                                            </div>
                                            <p className='mt-1 text-sm text-[#565656]'>
                                                $1463.26
                                            </p>
                                        </div>
                                    </div>

                                    <Button className='text-lg w-full bg-[#1a30ff] py-4 hover:bg-[#0f1b99]'>
                                        Repay & Close Trove
                                    </Button>
                                    <p className='mt-2 text-center text-sm text-[#565656]'>
                                        This action will open your wallet to
                                        sign the transaction.
                                    </p>
                                </>
                            )}
                        </>
                    )}
                </>
            </main>
        </div>
    );
};
