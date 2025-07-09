import { ArrowDown } from 'lucide-react';
import React from 'react';

interface TokenBoxProps {
    inputLabel: string;
    inputValue: string;
    onInputChange: (value: string) => void;
    inputTokenIcon?: React.ReactNode;
    outputLabel: string;
    outputValue: string;
    outputSubLabel?: string;
    outputTokenIcon?: React.ReactNode;
    children?: React.ReactNode;
}
export const TokenBox: React.FC<TokenBoxProps> = ({
    inputLabel,
    inputValue,
    onInputChange,
    inputTokenIcon,
    outputLabel,
    outputValue,
    outputSubLabel,
    outputTokenIcon,
    children,
}) => {
    return (
        <div className='flex w-full max-w-3xl flex-col items-center'>
            <div className='mx-auto w-full space-y-2'>
                <div className='shadow-sm flex h-32 w-full items-center justify-between rounded-xl border border-[#e3e3e3] bg-white p-4'>
                    <div className='flex-1'>
                        <label className='mb-1 block text-sm font-medium text-[#001C33]'>
                            {inputLabel}
                        </label>
                        <input
                            type='number'
                            className='text-2xl w-full bg-transparent font-semibold text-[#001C33] outline-none placeholder:text-[#8E8E93]'
                            value={inputValue}
                            onChange={e => onInputChange(e.target.value)}
                            placeholder='0.0'
                            min='0'
                            step='any'
                        />
                    </div>
                    {inputTokenIcon && (
                        <div className='ml-3 flex items-center gap-2 rounded-full border border-[#E5E5EA] bg-[#F5F5F5] px-3 py-1.5'>
                            {inputTokenIcon}
                        </div>
                    )}
                </div>

                <div className='relative flex justify-center'>
                    <div className='shadow-md absolute -top-8 z-10 flex h-16 w-16 items-center justify-center rounded-lg border border-[#e3e3e3] bg-white'>
                        <ArrowDown className='h-5 w-5 text-[#001C33]' />
                    </div>
                </div>

                <div className='shadow-sm flex h-32 w-full items-center justify-between rounded-xl border border-[#e3e3e3] bg-white p-4'>
                    <div className='flex-1'>
                        <label className='mb-1 block text-sm font-medium text-[#001C33]'>
                            {outputLabel}
                        </label>
                        <div className='text-2xl font-semibold text-[#001C33]'>
                            {outputValue || '0.0'}
                        </div>
                        {outputSubLabel && (
                            <p className='mt-1 text-sm text-[#8E8E93]'>
                                {outputSubLabel}
                            </p>
                        )}
                    </div>
                    {outputTokenIcon && (
                        <div className='ml-3 flex items-center gap-2 rounded-full border border-[#E5E5EA] bg-[#F5F5F5] px-3 py-1.5'>
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
