import { Decimal } from '@secured-finance/stablecoin-lib-base';
import { ArrowDown } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
import { useBreakpoint, useNumericInput } from 'src/hooks';

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
    const isMobile = useBreakpoint('tablet');

    const { inputRef, inputProps } = useNumericInput({
        value: inputValue,
        onChange: onInputChange,
        onBlur: onInputBlur,
    });

    const { inputProps: outputProps } = useNumericInput({
        value: outputValue,
        onChange: onOutputChange ?? (() => undefined),
        onBlur: onOutputBlur,
    });

    // Auto focus input on mount, never on mobile.
    useEffect(() => {
        if (autoFocusInput && isConnected && !isMobile) {
            inputRef.current?.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoFocusInput, isConnected, isMobile]);

    // Parse strings to Decimals for the read only output display
    const cleanOutputValue =
        outputValue?.replace(/,/g, '').replace(/\.$/, '') ?? '';
    const outputDecimal = cleanOutputValue
        ? Decimal.from(cleanOutputValue)
        : Decimal.ZERO;

    return (
        <div className='w-full'>
            <div className='w-full space-y-1'>
                <div className='shadow-sm flex h-32 w-full items-center justify-between rounded-xl border border-neutral-9 bg-white p-4'>
                    <div className='min-w-0 flex-1'>
                        <label className='mb-1 block font-primary text-base font-medium text-neutral-900'>
                            {inputLabel}
                        </label>
                        <input
                            {...inputProps}
                            className={`h-[48px] w-full bg-transparent font-primary text-8 font-medium leading-none outline-none placeholder:text-neutral-400 ${
                                isConnected
                                    ? 'text-neutral-900'
                                    : 'text-neutral-400'
                            }`}
                            placeholder='0.00'
                            disabled={!isConnected}
                        />

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
                            <input
                                {...outputProps}
                                className={`h-[48px] w-full bg-transparent font-primary text-8 font-medium leading-none outline-none placeholder:text-neutral-400 ${
                                    isConnected
                                        ? 'text-neutral-900'
                                        : 'text-neutral-400'
                                }`}
                                placeholder='0.00'
                                disabled={!isConnected}
                            />
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
