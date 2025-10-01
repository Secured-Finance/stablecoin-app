import { Decimal } from '@secured-finance/stablecoin-lib-base';
import { useEffect, useState } from 'react';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
import { USDFCIconLarge } from 'src/components/SecuredFinanceLogo';
import { useAccount } from 'wagmi';

export function StabilityAmountInput({
    label,
    displayAmount,
    handleInputChange,
    maxAmount,
    onMaxClick,
    disabled,
    autoFocus = true,
    focusKey,
}: {
    label: string;
    displayAmount: string;
    handleInputChange: (val: string) => void;
    maxAmount: Decimal;
    onMaxClick: () => void;
    disabled: boolean;
    autoFocus?: boolean;
    focusKey?: string | number;
}) {
    const { isConnected } = useAccount();
    const [editing, setEditing] = useState(autoFocus);

    // Auto focus on mount or when focusKey changes if autoFocus is true
    useEffect(() => {
        if (autoFocus && isConnected && !disabled) {
            setEditing(true);
        }
    }, [autoFocus, isConnected, disabled, focusKey]);

    const cleanAmount = displayAmount?.replace(/,/g, '') || '';
    const decimal =
        cleanAmount && cleanAmount !== '' && cleanAmount !== '.'
            ? Decimal.from(cleanAmount) || Decimal.ZERO
            : Decimal.ZERO;

    const getCleanEditingValue = () =>
        decimal.isZero ? '' : decimal.toString();

    return (
        <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-4'>
            <div className='mb-2 font-primary text-4 font-medium leading-[100%]'>
                {label}
            </div>
            <div className='mb-1 flex items-center justify-between'>
                {editing ? (
                    <input
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus={true}
                        className={`w-full bg-transparent font-primary text-2xl font-medium leading-none outline-none placeholder:text-neutral-350 laptop:text-8 ${
                            disabled ? 'text-neutral-400' : 'text-neutral-900'
                        }`}
                        type='text'
                        step='any'
                        defaultValue={getCleanEditingValue()}
                        onKeyDown={e => {
                            if (
                                !/[0-9.]/.test(e.key) &&
                                ![
                                    'Backspace',
                                    'Delete',
                                    'ArrowLeft',
                                    'ArrowRight',
                                    'Tab',
                                ].includes(e.key)
                            ) {
                                e.preventDefault();
                            }
                        }}
                        onChange={e => {
                            const value = e.target.value;
                            if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                                handleInputChange(value);
                            }
                        }}
                        onBlur={() => setEditing(false)}
                        placeholder='0.00'
                        disabled={disabled}
                    />
                ) : (
                    <div
                        className={`w-full font-primary text-2xl font-medium leading-none laptop:text-8 ${
                            disabled
                                ? 'text-neutral-400'
                                : 'cursor-text text-neutral-900'
                        }`}
                        onClick={() => !disabled && setEditing(true)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                !disabled && setEditing(true);
                            }
                        }}
                        role='button'
                        tabIndex={disabled ? -1 : 0}
                    >
                        {displayAmount && displayAmount !== '0'
                            ? decimal.prettify(2)
                            : '0.00'}
                    </div>
                )}
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
                            const maxStr = maxAmount.toString();
                            handleInputChange(maxStr);
                            onMaxClick();
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
