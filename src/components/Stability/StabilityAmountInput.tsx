import { Decimal } from '@secured-finance/stablecoin-lib-base';
import { useEffect } from 'react';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
import { USDFCIconLarge } from 'src/components/SecuredFinanceLogo';
import { useBreakpoint, useNumericInput } from 'src/hooks';
import { useAccount } from 'wagmi';

export function StabilityAmountInput({
    label,
    displayAmount,
    handleInputChange,
    onInputBlur,
    maxAmount,
    onMaxClick,
    disabled,
    autoFocus = true,
    focusKey,
}: {
    label: string;
    displayAmount: string;
    handleInputChange: (val: string) => void;
    onInputBlur?: () => void;
    maxAmount: Decimal;
    onMaxClick?: () => void;
    disabled: boolean;
    autoFocus?: boolean;
    focusKey?: string | number;
}) {
    const { isConnected } = useAccount();
    const isMobile = useBreakpoint('tablet');
    const { inputRef, inputProps } = useNumericInput({
        value: displayAmount,
        onChange: handleInputChange,
        onBlur: onInputBlur,
    });

    // Auto focus on mount or when the tab changes, never on mobile.
    useEffect(() => {
        if (autoFocus && !isMobile && isConnected && !disabled) {
            inputRef.current?.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoFocus, isMobile, isConnected, disabled, focusKey]);

    const cleanAmount =
        displayAmount?.replace(/,/g, '').replace(/\.$/, '') ?? '';
    const decimal = cleanAmount ? Decimal.from(cleanAmount) : Decimal.ZERO;

    return (
        <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-4'>
            <div className='mb-2 font-primary text-4 font-medium leading-[100%]'>
                {label}
            </div>
            <div className='mb-1 flex items-center justify-between'>
                <input
                    {...inputProps}
                    className={`w-full bg-transparent font-primary text-2xl font-medium leading-none outline-none placeholder:text-neutral-350 laptop:text-8 ${
                        disabled ? 'text-neutral-400' : 'text-neutral-900'
                    }`}
                    placeholder='0.00'
                    disabled={disabled}
                />
                <div
                    className='ml-2 flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-175 px-2 py-1 laptop:ml-3 laptop:gap-2 laptop:px-3 laptop:py-1.5'
                    style={{ minWidth: '90px' }}
                >
                    <USDFCIconLarge />
                    <span className='text-lg font-medium leading-none text-neutral-900 laptop:text-2xl'>
                        USDFC
                    </span>
                </div>
            </div>
            <div className='flex items-center justify-between font-primary text-base font-normal leading-none text-neutral-450'>
                <div className='min-w-0 flex-1'>
                    <div className='flex gap-1'>
                        <span className='truncate'>${decimal.prettify(2)}</span>
                    </div>
                </div>
                <div className='mt-2 flex items-center gap-2'>
                    <span>{maxAmount.prettify(2)} USDFC</span>
                    <Button
                        onClick={() => {
                            // Full precision on purpose: a 2dp cap would strand
                            // dust and make the position impossible to empty.
                            handleInputChange(maxAmount.toString());
                            onMaxClick?.();
                        }}
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
