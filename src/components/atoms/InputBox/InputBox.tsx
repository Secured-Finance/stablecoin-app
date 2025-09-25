import React, { useState } from 'react';
import { Decimal } from '@secured-finance/stablecoin-lib-base';

interface InputBoxProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    tokenIcon?: React.ReactNode;
    subLabel?: string;
    disabled?: boolean;
    type?: 'text' | 'number';
    readOnly?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    autoFocus?: boolean;
}

export const InputBox = ({
    label,
    value,
    onChange,
    tokenIcon,
    subLabel,
    disabled = false,
    type = 'number',
    readOnly = false,
    onFocus,
    onBlur,
}: InputBoxProps) => {
    const [editing, setEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value);

    // Sync edited value when parent value changes and not editing
    React.useEffect(() => {
        if (!editing) {
            setEditedValue(value);
        }
    }, [value, editing]);

    // Parse string to Decimal for display with safe parsing
    const parseDecimal = (val: string) => {
        try {
            const cleaned = val?.replace(/,/g, '') || '';
            if (
                cleaned === '' ||
                cleaned === '.' ||
                cleaned === '-' ||
                isNaN(Number(cleaned))
            ) {
                return Decimal.ZERO;
            }
            return Decimal.from(cleaned);
        } catch {
            return Decimal.ZERO;
        }
    };

    const decimal = parseDecimal(value);

    return (
        <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-6'>
            <span className='mb-2 block text-sm font-medium'>{label}</span>
            <div className='flex items-center'>
                <div className='flex grow'>
                    {editing ? (
                        <input
                            // eslint-disable-next-line jsx-a11y/no-autofocus
                            autoFocus
                            type={type}
                            step='any'
                            value={editedValue}
                            onChange={e => {
                                const value = e.target.value;
                                // Only allow numbers and decimal point
                                if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                                    setEditedValue(value);
                                    onChange(value);
                                }
                            }}
                            onFocus={() => {
                                // Show raw number without commas when editing starts
                                const cleanValue =
                                    value?.replace(/,/g, '') || '';
                                setEditedValue(cleanValue);
                                onFocus?.();
                            }}
                            onBlur={() => {
                                setEditing(false);
                                onBlur?.();
                            }}
                            className='w-full bg-transparent text-8 font-semibold text-neutral-900 outline-none placeholder:text-neutral-350'
                            disabled={disabled}
                            readOnly={readOnly}
                            placeholder='0.00'
                        />
                    ) : (
                        <div
                            className='w-full cursor-text text-8 font-semibold text-neutral-900'
                            onClick={() =>
                                !disabled && !readOnly && setEditing(true)
                            }
                            onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    !disabled && !readOnly && setEditing(true);
                                }
                            }}
                            role='button'
                            tabIndex={disabled || readOnly ? -1 : 0}
                        >
                            {decimal.isZero ? '0.00' : decimal.prettify(2)}
                        </div>
                    )}
                </div>
                {tokenIcon && (
                    <div className='ml-3 flex items-center gap-2 rounded-full border border-neutral-175 px-3 py-1.5'>
                        {tokenIcon}
                    </div>
                )}
            </div>
            {subLabel && (
                <p className='mt-1 text-sm text-neutral-450'>{subLabel}</p>
            )}
        </div>
    );
};
