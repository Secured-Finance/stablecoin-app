import React, { useEffect } from 'react';
import { useBreakpoint, useNumericInput } from 'src/hooks';
import { Button, ButtonSizes, ButtonVariants } from '../index';

interface InputBoxProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    tokenIcon?: React.ReactNode;
    subLabel?: string;
    disabled?: boolean;
    readOnly?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    autoFocus?: boolean;
    maxValue?: string;
    onMaxClick?: () => void;
    maxToken?: string;
}

export const InputBox = ({
    label,
    value,
    onChange,
    tokenIcon,
    subLabel,
    disabled = false,
    readOnly = false,
    onFocus,
    onBlur,
    autoFocus = false,
    maxValue,
    onMaxClick,
    maxToken,
}: InputBoxProps) => {
    const isMobile = useBreakpoint('tablet');
    const { inputRef, inputProps } = useNumericInput({
        value,
        onChange,
        onFocus,
        onBlur,
    });

    // Never auto focus on mobile: it would open the keyboard unprompted.
    useEffect(() => {
        if (autoFocus && !disabled && !readOnly && !isMobile) {
            inputRef.current?.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-6'>
            <span className='mb-2 block font-primary text-4 font-medium leading-[100%]'>
                {label}
            </span>
            <div className='flex items-center'>
                <div className='min-w-0 flex-1'>
                    <input
                        {...inputProps}
                        className='w-full bg-transparent font-primary text-8 font-medium leading-none text-neutral-900 outline-none placeholder:text-neutral-350'
                        disabled={disabled}
                        readOnly={readOnly}
                        placeholder='0.00'
                    />
                </div>
                {tokenIcon && (
                    <div className='ml-2 flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-175 px-2 py-1 laptop:ml-3 laptop:gap-2 laptop:px-3 laptop:py-1.5'>
                        {tokenIcon}
                    </div>
                )}
            </div>
            <div className='mt-2 flex items-center justify-between'>
                {subLabel && (
                    <p className='truncate font-primary text-base font-normal leading-none text-neutral-450'>
                        {subLabel}
                    </p>
                )}
                {maxValue && onMaxClick && !disabled && (
                    <div className='flex items-center gap-2 text-sm text-neutral-350'>
                        <span>
                            {maxValue} {maxToken}
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
    );
};
