import { USDFCIcon } from 'src/components/SecuredFinanceLogo';
import { Decimal } from '@secured-finance/stablecoin-lib-base';
import { COIN } from 'src/strings';
import { useAccount } from 'wagmi';

export function StabilityAmountInput({
    label,
    displayAmount,
    handleInputChange,
    maxAmount,
    onMaxClick,
    disabled,
    currentBalance,
}: {
    label: string;
    displayAmount: string;
    handleInputChange: (val: string) => void;
    maxAmount: Decimal;
    onMaxClick: () => void;
    disabled: boolean;
    currentBalance?: Decimal;
}) {
    const { isConnected } = useAccount();
    return (
        <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-4'>
            <div className='mb-2 text-sm font-medium'>{label}</div>
            <div className='mb-1 flex items-center justify-between'>
                <input
                    className='w-full bg-transparent text-8 font-medium focus:outline-none'
                    value={displayAmount}
                    onChange={e => handleInputChange(e.target.value)}
                    type='number'
                    disabled={disabled}
                    placeholder='0.00'
                />
                <div className='ml-2 flex items-center justify-center'>
                    <USDFCIcon />
                </div>
            </div>
            <div className='flex items-center justify-between text-sm text-[#565656]'>
                <div>
                    {isConnected && currentBalance && (
                        <div className='flex gap-1'>
                            <span>{currentBalance.prettify()}</span>
                            <span>{COIN}</span>
                        </div>
                    )}
                </div>
                <div>
                    {maxAmount.prettify()} {COIN}{' '}
                    <button
                        className='ml-1 cursor-pointer text-[#1a30ff] disabled:cursor-not-allowed disabled:opacity-50'
                        onClick={onMaxClick}
                        disabled={disabled}
                    >
                        Max
                    </button>
                </div>
            </div>
        </div>
    );
}
