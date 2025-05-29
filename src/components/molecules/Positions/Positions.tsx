import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import { Layers2, Vault } from 'lucide-react';
import { useSfStablecoinReducer, useSfStablecoinSelector } from 'src/hooks';
import { Link } from 'react-router-dom';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { init, reduce } from 'src/components/Stability/StabilityDepositManager';
import { SecuredFinanceLogo } from 'src/components/SecuredFinanceLogo';

export function Positions() {
    const select = ({
        debtTokenBalance,
        debtTokenInStabilityPool,
        trove,
        price,
    }: SfStablecoinStoreState) => ({
        debtTokenBalance,
        debtTokenInStabilityPool,
        trove,
        price,
    });

    const { debtTokenInStabilityPool, trove, price } =
        useSfStablecoinSelector(select);

    const collateralRatio =
        !trove.collateral.isZero && !trove.netDebt.isZero
            ? trove.collateralRatio(price)
            : undefined;

    const [{ originalDeposit }] = useSfStablecoinReducer(reduce, init);

    const liquidationGains = originalDeposit.collateralGain.prettify(2);
    const originalPoolShare = originalDeposit.currentDebtToken.mulDiv(
        100,
        debtTokenInStabilityPool
    );

    return (
        <div>
            <h2 className='mb-3 font-primary text-5 font-semibold text-neutral-900'>
                My Positions
            </h2>
            <div className='grid grid-cols-1 gap-3 laptop:grid-cols-2'>
                {/* Trove Card */}
                <div className='shadow-sm w-full rounded-2xl border border-neutral-200 bg-white p-6'>
                    <div className='mb-6 flex items-center gap-3'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5ff]'>
                            <Vault className='h-6 w-6 text-primary-500' />
                        </div>
                        <h3 className='text-xl font-semibold text-neutral-900'>
                            Trove
                        </h3>
                    </div>

                    <div className='mb-6'>
                        <p className='text-sm text-neutral-600'>Total Debt</p>
                        <div className='text-2xl flex items-center gap-1 font-semibold text-neutral-900'>
                            {trove.debt.prettify()} <SecuredFinanceLogo />
                        </div>
                    </div>

                    <div className='space-y-3 text-sm text-neutral-700'>
                        <div className='flex justify-between'>
                            <span>Collateral</span>
                            <span>{trove.collateral.prettify()} FIL</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Collateral Ratio</span>
                            <span>{collateralRatio?.mul(100).prettify()}%</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Liquidation Risk</span>
                            <span className='rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'>
                                Low
                            </span>
                        </div>
                    </div>

                    <Link
                        to='/trove'
                        className='mt-6 block w-full rounded-lg border border-neutral-300 bg-white py-2 text-center text-sm font-medium text-neutral-900 hover:bg-neutral-50'
                    >
                        Manage Trove
                    </Link>
                </div>

                {/* Stability Pool Card */}
                <div className='shadow-sm flex w-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6'>
                    <div className='mb-6 flex items-center gap-3'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5ff]'>
                            <Layers2 className='h-6 w-6 text-primary-500' />
                        </div>
                        <h3 className='text-xl font-semibold text-neutral-900'>
                            Stability Pool
                        </h3>
                    </div>

                    <div className='mb-6'>
                        <p className='text-sm text-neutral-600'>
                            Liquidation Gain
                        </p>
                        <div className='text-lg flex items-center gap-2 font-semibold text-neutral-900'>
                            {liquidationGains} <FILIcon />
                            FIL
                            {/* <span className='text-sm text-neutral-500'>
                                $0.34
                            </span> */}
                        </div>
                    </div>

                    <div className='space-y-3 text-sm text-neutral-700'>
                        <div className='flex justify-between'>
                            <span>Deposit</span>
                            <span>
                                {originalDeposit.currentDebtToken.prettify()}{' '}
                                USDFC
                            </span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Pool Share</span>
                            <span>{originalPoolShare.prettify()}%</span>
                        </div>
                    </div>

                    <div className='mt-6 flex gap-3'>
                        <Link
                            to='/stability-pool'
                            className=' w-full rounded-lg border border-neutral-300 bg-white py-2 text-center text-sm font-medium text-neutral-900 hover:bg-neutral-50'
                        >
                            Manage Deposit
                        </Link>
                        <button className='w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700'>
                            Claim Gains
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
