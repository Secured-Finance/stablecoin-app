import { ArrowDown } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';

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
}: TokenBoxProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isConnected) {
            inputRef.current?.focus();
        }
    }, [isConnected]);

    return (
        <div className='w-full'>
            <div className='w-full space-y-1'>
                <div className='shadow-sm flex h-32 w-full items-center justify-between rounded-xl border border-neutral-9 bg-white p-4'>
                    <div className='flex-1'>
                        <label className='mb-1 block font-primary text-4 font-medium text-neutral-900'>
                            {inputLabel}
                        </label>
                        <input
                            type='text'
                            inputMode='decimal'
                            className='w-full bg-transparent text-8 font-semibold text-neutral-900 outline-none placeholder:text-neutral-350'
                            value={inputValue}
                            ref={inputRef}
                            onChange={e => {
                                const value = e.target.value;
                                if (/^\d*\.?\d*$/.test(value)) {
                                    onInputChange(value);
                                }
                            }}
                            onBlur={onInputBlur}
                            placeholder='0.0'
                            disabled={!isConnected}
                        />

                        {inputSubLabel && (
                            <p className='mt-1 text-sm text-neutral-350'>
                                {inputSubLabel}
                            </p>
                        )}
                    </div>
                    <div className='ml-3 flex flex-col items-end gap-2'>
                        {inputTokenIcon && (
                            <div className='flex items-center gap-2 rounded-full border border-neutral-175 px-3 py-1.5'>
                                {inputTokenIcon}
                            </div>
                        )}
                        {maxValue && onMaxClick && isConnected && (
                            <div className='flex items-center gap-2 text-sm text-neutral-350'>
                                <span>{maxValue}</span>
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
                    <div className='flex-1'>
                        <label className='mb-1 block font-primary text-4 font-medium text-neutral-900'>
                            {outputLabel}
                        </label>
                        {onOutputChange ? (
                            <input
                                type='text'
                                inputMode='decimal'
                                className='w-full bg-transparent text-8 font-semibold text-neutral-900 outline-none placeholder:text-neutral-350'
                                value={outputValue}
                                onChange={e => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d*$/.test(value)) {
                                        onOutputChange(value);
                                    }
                                }}
                                onBlur={onOutputBlur}
                                placeholder='0.0'
                                disabled={!isConnected}
                            />
                        ) : (
                            <div className='text-8 font-semibold text-neutral-900'>
                                {outputValue || '0.0'}
                            </div>
                        )}
                        {outputSubLabel && (
                            <p className='mt-1 text-sm text-neutral-350'>
                                {outputSubLabel}
                            </p>
                        )}
                    </div>
                    {outputTokenIcon && (
                        <div className='ml-3 flex items-center gap-2 rounded-full border border-neutral-175 px-3 py-1.5'>
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
