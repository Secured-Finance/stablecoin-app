import { Decimal } from '@secured-finance/stablecoin-lib-base';
import { useEffect, useState } from 'react';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
import { USDFCIconLarge } from 'src/components/SecuredFinanceLogo';
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
    autoFocus = true,
    focusKey,
}: {
    label: string;
    displayAmount: string;
    handleInputChange: (val: string) => void;
    maxAmount: Decimal;
    onMaxClick: () => void;
    disabled: boolean;
    currentBalance?: Decimal;
    autoFocus?: boolean;
    focusKey?: string | number;
}) {
    const { isConnected } = useAccount();
    const [editing, setEditing] = useState(autoFocus);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [editedAmount, setEditedAmount] = useState(displayAmount);

    // Auto focus on mount or when focusKey changes if autoFocus is true
    useEffect(() => {
        if (autoFocus && isConnected && !disabled) {
            setEditing(true);
        }
    }, [autoFocus, isConnected, disabled, focusKey]);

    useEffect(() => {
        if (!editing) {
            setEditedAmount(displayAmount);
        }
    }, [displayAmount, editing]);

    const cleanAmount = displayAmount?.replace(/,/g, '') || '';
    const decimal =
        cleanAmount && cleanAmount !== '' && cleanAmount !== '.'
            ? Decimal.from(cleanAmount) || Decimal.ZERO
            : Decimal.ZERO;

    const getCleanEditingValue = () =>
        decimal.isZero ? '0.00' : decimal.toString();

    return (
        <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-4'>
            <div className='mb-2 text-sm font-medium'>{label}</div>
            <div className='mb-1 flex items-center justify-between'>
                {editing ? (
                    <input
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus={true}
                        className='w-full bg-transparent text-8 font-semibold text-neutral-900 outline-none placeholder:text-neutral-350'
                        type='number'
                        step='any'
                        defaultValue={getCleanEditingValue()}
                        onChange={e => {
                            const value = e.target.value;
                            if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                                setEditedAmount(value);
                                handleInputChange(value);
                            }
                        }}
                        onBlur={() => setEditing(false)}
                        placeholder='0.00'
                        disabled={disabled}
                    />
                ) : (
                    <div
                        className='w-full cursor-text text-8 font-semibold text-neutral-900'
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
                <div className='ml-2 flex items-center gap-2 rounded-full border border-neutral-175 px-3 py-1.5'>
                    <USDFCIconLarge />
                    <span className='text-2xl font-medium leading-none text-neutral-900'>
                        USDFC
                    </span>
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
                <div className='mt-2 flex items-center gap-2'>
                    <span>
                        {maxAmount.prettify(2)} {COIN}
                    </span>
                    <Button
                        onClick={() => {
                            const maxStr = maxAmount.toString();
                            setEditedAmount(maxStr);
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
