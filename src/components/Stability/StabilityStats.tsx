import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { SecuredFinanceLogo } from 'src/components/SecuredFinanceLogo';
import {
    StabilityDeposit,
    Decimal,
} from '@secured-finance/stablecoin-lib-base';

export function StabilityStats({
    originalDeposit,
    originalPoolShare,
    liquidationGains,
}: {
    originalDeposit: StabilityDeposit;
    originalPoolShare: Decimal;
    liquidationGains: string;
}) {
    return (
        <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
            <div className='grid grid-cols-3 gap-4'>
                <Stat label='Current Deposit'>
                    <span>{originalDeposit.currentDebtToken.prettify()}</span>
                    <SecuredFinanceLogo />
                </Stat>
                <Stat label='Pool Share'>{originalPoolShare.prettify()}%</Stat>
                <Stat label='Liquidation Gains'>
                    <div className='flex items-center gap-1 font-medium'>
                        <span>{liquidationGains}</span>
                        <FILIcon />
                        <span>FIL</span>
                    </div>
                    <button className='text-xs font-medium text-[#1a30ff] hover:underline'>
                        Claim Gains
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
