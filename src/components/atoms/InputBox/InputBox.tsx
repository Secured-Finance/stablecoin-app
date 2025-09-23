import React from 'react';

interface InputBoxProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    tokenIcon?: React.ReactNode;
    subLabel?: string;
    disabled?: boolean;
    type?: 'text' | 'number';
    readOnly?: boolean;
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
}: InputBoxProps) => {
    return (
        <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-6'>
            <span className='mb-2 block text-sm font-medium'>{label}</span>
            <div className='flex items-center'>
                <div className='flex grow'>
                    <input
                        type={type}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className='w-full bg-transparent text-8 font-semibold text-neutral-900 outline-none placeholder:text-neutral-350'
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                </div>
                {tokenIcon && (
                    <div className='ml-4 flex min-w-[90px] items-center justify-end gap-2'>
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
