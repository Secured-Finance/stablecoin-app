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
        <div className='mb-6 flex flex-col gap-6'>
            <h2 className='font-primary text-5 font-semibold leading-6 text-neutral-900'>
                Your Deposit
            </h2>
            <div className='flex flex-col gap-6 rounded-[20px] border border-neutral-150 bg-white p-6 font-primary tablet:flex-row tablet:justify-between'>
                <div className='flex flex-col gap-6 tablet:flex-row tablet:gap-8'>
                    <Stat label='Deposit'>
                        <span className='font-primary text-4 font-medium leading-[19px] text-neutral-900'>
                            {originalDeposit.currentDebtToken.prettify()}
                        </span>
                        <USDFCIcon className='h-4 w-4' />
                        <span className='font-primary text-4 font-normal leading-[19px] text-neutral-900'>
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
                        <span className='font-primary text-4 font-medium leading-[19px] text-neutral-900'>
                            {originalPoolShare.prettify()}%
                        </span>
                    </Stat>
                </div>

                <div className='flex flex-col justify-center gap-3 tablet:mx-auto'>
                    <div className='font-primary text-4 font-medium leading-[19px] text-neutral-450'>
                        Liquidation Gains
                    </div>
                    <div className='flex flex-col items-start gap-2 tablet:gap-0 tablet:gap-y-2'>
                        <div className='flex flex-wrap items-center gap-2 tablet:gap-4'>
                            <div className='flex items-center gap-2'>
                                <span className='font-primary text-4 font-medium leading-[19px] text-neutral-900'>
                                    {liquidationGains}
                                </span>
                                <FILIcon className='h-4 w-4' />
                                <span className='font-primary text-4 font-normal leading-[19px] text-neutral-900'>
                                    {CURRENCY}
                                </span>
                            </div>
                            <span className='font-primary text-sm font-normal leading-[17px] text-neutral-450'>
                                ${liquidationGainsUSD.prettify()}
                            </span>
                            <button
                                className={`font-primary text-sm font-semibold leading-[17px] tablet:ml-0 ${
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
                <div className='font-primary text-4 font-medium leading-[19px] text-neutral-450'>
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
            <div className='flex items-center gap-2'>{children}</div>
        </div>
    );
}
