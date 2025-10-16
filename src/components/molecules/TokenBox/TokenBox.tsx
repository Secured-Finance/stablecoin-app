import { ArrowDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
import { Decimal } from '@secured-finance/stablecoin-lib-base';

interface TokenBoxProps {
    inputLabel: string;
    inputValue: string;
    onInputChange: (value: string) => void;
    onInputBlur?: () => void;
    inputTokenIcon?: React.ReactNode;
    outputLabel: string;
    outputValue: string;
    onOutputChange?: (value: string) => void;
    onOutputBlur?: () => void;
    inputSubLabel?: string;
    outputSubLabel?: string;
    outputTokenIcon?: React.ReactNode;
    isConnected: boolean;
    children?: React.ReactNode;
    maxValue?: string;
    onMaxClick?: () => void;
    autoFocusInput?: boolean;
}
export const TokenBox = ({
    inputLabel,
    inputValue,
    onInputChange,
    onInputBlur,
    inputTokenIcon,
    inputSubLabel,
    outputLabel,
    outputValue,
    onOutputChange,
    onOutputBlur,
    outputSubLabel,
    outputTokenIcon,
    isConnected,
    children,
    maxValue,
    onMaxClick,
    autoFocusInput,
}: TokenBoxProps) => {
    const [inputEditing, setInputEditing] = useState(autoFocusInput || false);
    const [outputEditing, setOutputEditing] = useState(false);

    // Auto focus input on mount if autoFocusInput is true
    useEffect(() => {
        if (autoFocusInput && isConnected) {
            // Small delay to ensure DOM is ready
            setTimeout(() => setInputEditing(true), 0);
        }
    }, [autoFocusInput, isConnected]);

    // Parse strings to Decimals for display
    const cleanInputValue = inputValue?.replace(/,/g, '') || '';
    const inputDecimal =
        cleanInputValue && cleanInputValue !== '' && cleanInputValue !== '.'
            ? Decimal.from(cleanInputValue) || Decimal.ZERO
            : Decimal.ZERO;

    const cleanOutputValue = outputValue?.replace(/,/g, '') || '';
    const outputDecimal =
        cleanOutputValue && cleanOutputValue !== '' && cleanOutputValue !== '.'
            ? Decimal.from(cleanOutputValue) || Decimal.ZERO
            : Decimal.ZERO;

    // Get clean values for editing (removing commas and keeping raw numbers)
    const getCleanInputValue = () => {
        const clean = inputValue?.replace(/,/g, '') || '';
        return clean === '' || clean === '0' || clean === '0.00' ? '' : clean;
    };

    const getCleanOutputValue = () => {
        const clean = outputValue?.replace(/,/g, '') || '';
        return clean === '' || clean === '0' ? '' : clean;
    };

    return (
        <div className='w-full'>
            <div className='w-full space-y-1'>
                <div className='shadow-sm flex h-32 w-full items-center justify-between rounded-xl border border-neutral-9 bg-white p-4'>
                    <div className='min-w-0 flex-1'>
                        <label className='mb-1 block font-primary text-base font-medium text-neutral-900'>
                            {inputLabel}
                        </label>
                        {inputEditing ? (
                            <input
                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus
                                type='text'
                                step='any'
                                className={`h-[48px] w-full bg-transparent font-primary text-8 font-medium leading-none outline-none placeholder:text-neutral-400 ${
                                    isConnected
                                        ? 'text-neutral-900'
                                        : 'text-neutral-400'
                                }`}
                                defaultValue={getCleanInputValue()}
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
                                        onInputChange(value);
                                    }
                                }}
                                onBlur={() => {
                                    setInputEditing(false);
                                    onInputBlur?.();
                                }}
                                placeholder='0.00'
                                disabled={!isConnected}
                            />
                        ) : (
                            <div
                                className={`flex h-[48px] w-full items-center overflow-hidden font-primary text-8 font-medium leading-none ${
                                    isConnected
                                        ? 'cursor-text text-neutral-900'
                                        : 'text-neutral-400'
                                }`}
                                onClick={() =>
                                    isConnected && setInputEditing(true)
                                }
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        isConnected && setInputEditing(true);
                                    }
                                }}
                                role='button'
                                tabIndex={isConnected ? 0 : -1}
                            >
                                <span className='truncate'>
                                    {inputDecimal.isZero
                                        ? '0.00'
                                        : inputDecimal.prettify(2)}
                                </span>
                            </div>
                        )}

                        {inputSubLabel && (
                            <p className='font-primary text-base font-normal leading-none text-neutral-350'>
                                {inputSubLabel}
                            </p>
                        )}
                    </div>
                    <div className='ml-3 flex shrink-0 flex-col items-end gap-4'>
                        {inputTokenIcon && (
                            <div className='flex items-center gap-2 rounded-full border border-neutral-175 px-3 py-2'>
                                {inputTokenIcon}
                            </div>
                        )}
                        {maxValue && onMaxClick && isConnected && (
                            <div className='flex items-center gap-2 text-sm text-neutral-350'>
                                <span className='whitespace-nowrap'>
                                    {maxValue}
                                </span>
                                <Button
                                    onClick={onMaxClick}
                                    size={ButtonSizes.pill}
                                    variant={ButtonVariants.pill}
                                >
                                    Max
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className='relative flex justify-center'>
                    <div className='shadow-md absolute -top-6 z-10 flex h-12 w-12 items-center justify-center rounded-3xl border-2 border-neutral-175 bg-neutral-150 tablet:-top-8 tablet:h-16 tablet:w-16'>
                        <ArrowDown className='sm:h-8 sm:w-8 h-6 w-6 text-neutral-900' />
                    </div>
                </div>

                <div className='shadow-sm flex h-32 w-full items-center justify-between rounded-xl border border-neutral-9 bg-white p-4'>
                    <div className='min-w-0 flex-1'>
                        <label className='mb-1 block font-primary text-base font-medium text-neutral-900'>
                            {outputLabel}
                        </label>
                        {onOutputChange ? (
                            outputEditing ? (
                                <input
                                    // eslint-disable-next-line jsx-a11y/no-autofocus
                                    autoFocus
                                    type='text'
                                    step='any'
                                    className={`h-[48px] w-full bg-transparent font-primary text-8 font-medium leading-none outline-none placeholder:text-neutral-400 ${
                                        isConnected
                                            ? 'text-neutral-900'
                                            : 'text-neutral-400'
                                    }`}
                                    defaultValue={getCleanOutputValue()}
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
                                        // Only allow numbers and decimal point
                                        if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                                            onOutputChange(value);
                                        }
                                    }}
                                    onBlur={() => {
                                        setOutputEditing(false);
                                        onOutputBlur?.();
                                    }}
                                    placeholder='0.00'
                                    disabled={!isConnected}
                                />
                            ) : (
                                <div
                                    className={`flex h-[48px] w-full items-center overflow-hidden font-primary text-8 font-medium leading-none ${
                                        isConnected
                                            ? 'cursor-text text-neutral-900'
                                            : 'text-neutral-400'
                                    }`}
                                    onClick={() =>
                                        isConnected && setOutputEditing(true)
                                    }
                                    onKeyDown={e => {
                                        if (
                                            e.key === 'Enter' ||
                                            e.key === ' '
                                        ) {
                                            isConnected &&
                                                setOutputEditing(true);
                                        }
                                    }}
                                    role='button'
                                    tabIndex={isConnected ? 0 : -1}
                                >
                                    <span className='truncate'>
                                        {outputDecimal.isZero
                                            ? '0.00'
                                            : outputDecimal.prettify(2)}
                                    </span>
                                </div>
                            )
                        ) : (
                            <div
                                className={`flex h-[48px] items-center overflow-hidden font-primary text-8 font-medium leading-none ${
                                    isConnected
                                        ? 'text-neutral-900'
                                        : 'text-neutral-400'
                                }`}
                            >
                                <span className='truncate'>
                                    {outputDecimal.isZero
                                        ? '0.00'
                                        : outputDecimal.prettify(2)}
                                </span>
                            </div>
                        )}
                        {outputSubLabel && (
                            <p className='font-primary text-base font-normal leading-none text-neutral-350'>
                                {outputSubLabel}
                            </p>
                        )}
                    </div>
                    {outputTokenIcon && (
                        <div className='ml-3 flex shrink-0 items-center gap-2 rounded-full border border-neutral-175 px-3 py-1.5'>
                            {outputTokenIcon}
                        </div>
                    )}
                </div>
            </div>

            {/* Below content (fees, button, etc.) */}
            {children && <div className='mt-6 w-full'>{children}</div>}
        </div>
    );
};
