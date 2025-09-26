import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { CURRENCY } from 'src/strings';
import { USDFCIcon } from 'src/components/SecuredFinanceLogo';
import {
    StabilityDeposit,
    Decimal,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { useTransactionFunction, useMyTransactionState } from '../Transaction';
import { CustomTooltip } from 'src/components/atoms';
import { openDocumentation } from 'src/constants';
import { Info } from 'lucide-react';

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

    const liquidationGainsDecimal = Decimal.from(
        (liquidationGains || '0').replace(/,/g, '')
    );
    const liquidationGainsUSD = liquidationGainsDecimal.mul(price);
    return (
        <div className='mb-6 rounded-xl border border-neutral-9 bg-white px-4 py-5'>
            <div className='grid grid-cols-1 gap-4 tablet:grid-cols-3 tablet:gap-2'>
                <Stat label='Current Deposit'>
                    <span>{originalDeposit.currentDebtToken.prettify()}</span>
                    <USDFCIcon />
                    <span>USDFC</span>
                </Stat>
                <Stat
                    label='Pool Share'
                    tooltip={{
                        title: 'Pool Share',
                        description:
                            'Your percentage of the Stability Pool, determining your share of liquidated collateral and rewards.',
                        onButtonClick: () => openDocumentation('stabilityPool'),
                    }}
                >
                    {originalPoolShare.prettify()}%
                </Stat>
                <Stat label='Liquidation Gains'>
                    <span>{liquidationGains}</span>
                    <FILIcon className='h-4 w-4' />
                    <span>{CURRENCY}</span>
                    <span className='text-sm text-neutral-450'>
                        ${liquidationGainsUSD.prettify()}
                    </span>
                    <button
                        className={`ml-2 text-xs font-medium underline ${
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
    tooltip,
}: {
    label: string;
    children: React.ReactNode;
    tooltip?: {
        title: string;
        description: string;
        buttonText?: string;
        onButtonClick?: () => void;
    };
}) {
    return (
        <div>
            <div className='mb-1 flex items-center gap-2'>
                <div className='text-sm text-neutral-450'>{label}</div>
                {tooltip && (
                    <CustomTooltip
                        title={tooltip.title}
                        description={tooltip.description}
                        onButtonClick={tooltip.onButtonClick}
                        position='top'
                    >
                        <Info className='h-5 w-5 cursor-pointer text-neutral-400 hover:text-blue-500' />
                    </CustomTooltip>
                )}
            </div>
            <div className='flex items-center gap-1 font-medium'>
                {children}
            </div>
        </div>
    );
}
