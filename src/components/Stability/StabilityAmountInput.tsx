import { USDFCIcon } from 'src/components/SecuredFinanceLogo';
import { Decimal } from '@secured-finance/stablecoin-lib-base';
import { COIN } from 'src/strings';
import { useAccount } from 'wagmi';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';

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
        <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-4'>
            <div className='mb-2 text-sm font-medium'>{label}</div>
            <div className='mb-1 flex items-center justify-between'>
                <input
                    className='w-full bg-transparent text-8 font-semibold text-neutral-900 outline-none placeholder:text-neutral-350'
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
            <div className='flex items-center justify-between text-sm text-neutral-450'>
                <div>
                    {isConnected && currentBalance && (
                        <div className='flex gap-1'>
                            <span>{currentBalance.prettify()}</span>
                            <span>{COIN}</span>
                        </div>
                    )}
                </div>
                <div className='flex items-center gap-2'>
                    <span>
                        {maxAmount.prettify(2)} {COIN}
                    </span>
                    <Button
                        onClick={onMaxClick}
                        disabled={disabled}
                        size={ButtonSizes.pill}
                        variant={ButtonVariants.pill}
                    >
                        Max
                    </Button>
                </div>
            </div>
        </div>
    );
}
