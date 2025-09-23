import { ArrowDown } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

interface TokenBoxProps {
    inputLabel: string;
    inputValue: string;
    onInputChange: (value: string) => void;
    inputTokenIcon?: React.ReactNode;
    outputLabel: string;
    outputValue: string;
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
    inputTokenIcon,
    inputSubLabel,
    outputLabel,
    outputValue,
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
        <div className='flex w-full max-w-3xl flex-col items-center'>
            <div className='mx-auto w-full space-y-1'>
                <div className='shadow-sm flex h-32 w-full items-center justify-between rounded-xl border border-[#e3e3e3] bg-white p-4'>
                    <div className='flex-1'>
                        <label className='mb-1 block font-primary text-4 font-medium text-[#001C33]'>
                            {inputLabel}
                        </label>
                        <input
                            type='text'
                            inputMode='decimal'
                            className='w-full bg-transparent text-8 font-semibold text-[#001C33] outline-none placeholder:text-[#8E8E93]'
                            value={inputValue}
                            ref={inputRef}
                            onChange={e => {
                                const value = e.target.value;
                                if (/^\d*\.?\d*$/.test(value)) {
                                    onInputChange(value);
                                }
                            }}
                            placeholder='0.0'
                            disabled={!isConnected}
                        />

                        <div className='flex items-center justify-between'>
                            {inputSubLabel && (
                                <p className='mt-1 text-sm text-[#8E8E93]'>
                                    {inputSubLabel}
                                </p>
                            )}
                            {maxValue && onMaxClick && isConnected && (
                                <div className='flex items-center gap-2 text-sm text-[#8E8E93]'>
                                    <span>{maxValue} USDFC</span>
                                    <button
                                        onClick={onMaxClick}
                                        className='text-[#1a30ff] hover:underline'
                                    >
                                        Max
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {inputTokenIcon && (
                        <div className='ml-3 flex items-center gap-2 rounded-full border border-[#E5E5EA] px-3 py-1.5'>
                            {inputTokenIcon}
                        </div>
                    )}
                </div>

                <div className='relative flex justify-center'>
                    <div className='shadow-md absolute -top-6 z-10 flex h-12 w-12 items-center justify-center rounded-3xl border-2 border-[#F0F0F0] bg-[#FAFAFA] tablet:-top-8 tablet:h-16 tablet:w-16'>
                        <ArrowDown className='sm:h-8 sm:w-8 h-6 w-6 text-[#001C33]' />
                    </div>
                </div>

                <div className='shadow-sm flex h-32 w-full items-center justify-between rounded-xl border border-[#e3e3e3] bg-white p-4'>
                    <div className='flex-1'>
                        <label className='mb-1 block font-primary text-4 font-medium text-[#001C33]'>
                            {outputLabel}
                        </label>
                        <div className='text-8 font-semibold text-[#001C33]'>
                            {outputValue || '0.0'}
                        </div>
                        {outputSubLabel && (
                            <p className='mt-1 text-sm text-[#8E8E93]'>
                                {outputSubLabel}
                            </p>
                        )}
                    </div>
                    {outputTokenIcon && (
                        <div className='ml-3 flex items-center gap-2 rounded-full border border-[#E5E5EA] px-3 py-1.5'>
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
