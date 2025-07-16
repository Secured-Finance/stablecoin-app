import {
    Decimal,
    StabilityDeposit,
} from '@secured-finance/stablecoin-lib-base';
import { SecuredFinanceLogo } from 'src/components/SecuredFinanceLogo';

export function DepositView({
    displayAmount,
    originalDeposit,
    originalPoolShare,
    COIN,
    isConnected,
    setShowManageView,
    open,
}: {
    displayAmount: string;
    originalDeposit: StabilityDeposit;
    originalPoolShare: Decimal;
    COIN: string;
    isConnected: boolean;
    setShowManageView: (val: boolean) => void;
    open: () => void;
}) {
    return (
        <>
            <h1 className='text-2xl mb-2 text-center font-bold'>
                Deposit USDFC into the Stability Pool
            </h1>
            <p className='mb-8 text-center text-sm text-[#565656]'>
                Deposit USDFC to earn FIL rewards. The pool helps maintain
                system stability by covering liquidated debt, ensuring a
                balanced and secure ecosystem.
            </p>

            <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-4'>
                <div className='mb-2 text-sm font-medium'>Deposit</div>
                <div className='mb-1 flex items-center justify-between'>
                    <div className='text-3xl font-medium'>{displayAmount}</div>
                    <div className='ml-20 flex '>
                        <div className='flex rounded-full '>
                            <SecuredFinanceLogo />
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-between'>
                    <div className='text-sm text-[#565656]'>
                        ${displayAmount}
                    </div>
                    <div className='flex gap-1 text-sm'>
                        <span>
                            {originalDeposit.currentDebtToken.prettify()}
                        </span>
                        <span>{COIN}</span>
                    </div>
                </div>
            </div>

            <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-4'>
                <div className='flex items-center justify-between'>
                    <div>
                        <div className='mb-1 text-sm font-medium'>
                            Pool Share
                        </div>
                        <div className='max-w-[280px] text-xs text-[#565656]'>
                            Your percentage of the Stability Pool, determining
                            your share of liquidated collateral and rewards.
                        </div>
                    </div>
                    <div className='text-base font-medium'>
                        {originalPoolShare.prettify()}%
                    </div>
                </div>
            </div>

            <button
                className='mb-3 w-full rounded-xl bg-[#1a30ff] py-3.5 font-medium text-white hover:bg-[#1a30ff]/90'
                onClick={() => {
                    if (isConnected) {
                        setShowManageView(true);
                    } else {
                        open();
                    }
                }}
            >
                {isConnected ? 'Deposit USDFC' : 'Connect Wallet'}
            </button>

            <p className='text-center text-xs text-[#565656]'>
                This action will open your wallet to sign the transaction.
            </p>
        </>
    );
}
