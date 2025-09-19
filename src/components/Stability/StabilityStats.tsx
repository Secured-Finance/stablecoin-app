import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { USDFCIcon } from 'src/components/SecuredFinanceLogo';
import {
    StabilityDeposit,
    Decimal,
} from '@secured-finance/stablecoin-lib-base';
import { useSfStablecoin } from 'src/hooks';
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
    return (
        <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
            <div className='grid grid-cols-3 gap-4'>
                <Stat label='Current Deposit'>
                    <span>{originalDeposit.currentDebtToken.prettify()}</span>
                    <div className='ml-2 flex items-center justify-center'>
                        <USDFCIcon />
                    </div>
                </Stat>
                <Stat label='Pool Share'>{originalPoolShare.prettify()}%</Stat>
                <Stat label='Liquidation Gains'>
                    <div className='flex items-center gap-1 font-medium'>
                        <span>{liquidationGains}</span>
                        <FILIcon />
                        <span>FIL</span>
                    </div>
                    <button
                        className={`text-xs font-medium ${
                            isClaimDisabled
                                ? 'cursor-not-allowed text-gray-400'
                                : 'cursor-pointer text-[#1a30ff] hover:underline'
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
            <div className='mb-1 text-sm text-[#565656]'>{label}</div>
            <div className='flex items-center gap-1 font-medium'>
                {children}
            </div>
        </div>
    );
}
