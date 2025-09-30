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
        <div className='mb-6 rounded-xl border border-neutral-200 bg-white p-4 font-primary tablet:rounded-[20px] tablet:border-neutral-150 tablet:p-6'>
            <div className='flex flex-col gap-6 tablet:flex-row tablet:items-start tablet:gap-8'>
                <div className='flex flex-col gap-4 tablet:flex-row tablet:gap-8'>
                    <Stat label='Deposit'>
                        <span className='text-base font-medium text-neutral-900'>
                            {originalDeposit.currentDebtToken.prettify()}
                        </span>
                        <USDFCIcon className='h-4 w-4' />
                        <span className='font-primary text-base font-normal text-neutral-900'>
                            USDFC
                        </span>
                    </Stat>
                    <Stat
                        label='Pool Share'
                        tooltip={{
                            title: 'Pool Share',
                            description:
                                'Your percentage of the Stability Pool, determining your share of liquidated collateral and rewards.',
                            onButtonClick: () =>
                                openDocumentation('stabilityPool'),
                        }}
                    >
                        <span className='text-base font-medium text-neutral-900'>
                            {originalPoolShare.prettify()}%
                        </span>
                    </Stat>
                </div>

                <div className='flex flex-col gap-3'>
                    <div className='text-base font-medium text-neutral-450'>
                        Liquidation Gains
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className='text-base font-medium text-neutral-900'>
                            {liquidationGains}
                        </span>
                        <FILIcon className='h-4 w-4' />
                        <span className='text-base font-normal text-neutral-900'>
                            {CURRENCY}
                        </span>
                        <span className='text-sm font-normal text-neutral-450'>
                            ${liquidationGainsUSD.prettify()}
                        </span>
                        <button
                            className={`max-w-24 text-left text-sm font-semibold ${
                                isClaimDisabled
                                    ? 'cursor-not-allowed text-neutral-400'
                                    : 'hover:text-primary-600 cursor-pointer text-neutral-900'
                            }`}
                            onClick={sendClaimTransaction}
                            disabled={isClaimDisabled}
                        >
                            {getClaimButtonText()}
                        </button>
                    </div>
                </div>
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
        <div className='flex min-w-0 flex-col gap-3'>
            <div className='flex items-center gap-1.5'>
                <div className='font-primary text-base font-medium text-neutral-450'>
                    {label}
                </div>
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
            <div className='flex flex-wrap items-center gap-2'>{children}</div>
        </div>
    );
}
