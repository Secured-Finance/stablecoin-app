import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { USDFCIcon } from 'src/components/SecuredFinanceLogo';
import {
    StabilityDeposit,
    Decimal,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { useTransactionFunction, useMyTransactionState } from '../Transaction';

export function StabilityStats({
    originalDeposit,
    originalPoolShare,
    liquidationGains,
}: {
    originalDeposit: StabilityDeposit;
    originalPoolShare: Decimal;
    liquidationGains: string;
}) {
    const { sfStablecoin } = useSfStablecoin();
    const myTransactionState = useMyTransactionState('stability-claim-gains');

    const price = useSfStablecoinSelector(
        (state: SfStablecoinStoreState) => state.price
    );

    const [sendClaimTransaction] = useTransactionFunction(
        myTransactionState.type,
        sfStablecoin.send.withdrawGainsFromStabilityPool.bind(sfStablecoin.send)
    );

    const isClaimDisabled =
        originalDeposit.collateralGain.isZero ||
        myTransactionState.type === 'waitingForApproval' ||
        myTransactionState.type === 'waitingForConfirmation';

    const getClaimButtonText = () => {
        if (myTransactionState.type === 'waitingForApproval')
            return 'Waiting for Approval...';
        if (myTransactionState.type === 'waitingForConfirmation')
            return 'Processing...';
        return 'Claim Gains';
    };

    const liquidationGainsDecimal = Decimal.from(liquidationGains || '0');
    const liquidationGainsUSD = liquidationGainsDecimal.mul(price);
    return (
        <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-6'>
            <div className='grid grid-cols-1 gap-4 tablet:grid-cols-3 tablet:gap-2'>
                <Stat label='Current Deposit'>
                    <span>{originalDeposit.currentDebtToken.prettify()}</span>
                    <div className='ml-2 flex items-center justify-center gap-1.5'>
                        <USDFCIcon />
                        <span>USDFC</span>
                    </div>
                </Stat>
                <Stat label='Pool Share'>{originalPoolShare.prettify()}%</Stat>
                <Stat label='Liquidation Gains'>
                    <div className='flex items-baseline gap-1.5 font-medium'>
                        <span>{liquidationGains}</span>
                        <FILIcon />
                        <span>FIL</span>
                        <span className='text-sm text-neutral-450'>
                            ${liquidationGainsUSD.prettify()}
                        </span>
                    </div>
                    <button
                        className={`text-xs font-medium underline ${
                            isClaimDisabled
                                ? 'cursor-not-allowed text-neutral-400'
                                : 'hover:text-primary-600 cursor-pointer text-primary-500'
                        }`}
                        onClick={sendClaimTransaction}
                        disabled={isClaimDisabled}
                    >
                        {getClaimButtonText()}
                    </button>
                </Stat>
            </div>
        </div>
    );
}

function Stat({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className='mb-1 text-sm text-neutral-450'>{label}</div>
            <div className='flex items-center gap-1 font-medium'>
                {children}
            </div>
        </div>
    );
}
