import type { TippyProps } from '@tippyjs/react';
import Tippy from '@tippyjs/react/headless';
import React from 'react';
import { useBreakpoint } from 'src/hooks';

interface CustomTooltipProps extends Pick<TippyProps, 'placement'> {
    title: string;
    description: string;
    buttonText?: string;
    onButtonClick?: () => void;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
    title,
    description,
    buttonText = 'Read more',
    onButtonClick,
    children,
    position = 'top',
    className = '',
    placement,
}) => {
    const isMobile = useBreakpoint('tablet');
    const tippyPlacement = placement || position;
    const responsivePlacement = isMobile ? 'auto-start' : tippyPlacement;
    const tooltipWidth = isMobile ? '280px' : '329px';

    const handleButtonClick = onButtonClick || (() => {});

    return (
        <Tippy
            interactive
            placement={responsivePlacement}
            render={attrs => (
                <div style={{ width: tooltipWidth }} {...attrs}>
                    <div className='shadow-lg flex flex-col gap-4 rounded-2xl border border-black bg-[#23242C] p-4 tablet:gap-6 tablet:p-6'>
                        <div className='flex flex-col gap-2 tablet:gap-3'>
                            <h3 className='text-sm font-semibold leading-[1.4] text-white tablet:text-base'>
                                {title}
                            </h3>
                            <p className='text-xs font-normal leading-[1.4] text-[#BEBEBE] tablet:text-sm'>
                                {description}
                            </p>
                        </div>
                        <button
                            onClick={handleButtonClick}
                            type='button'
                            className='flex h-8 items-center justify-center gap-2 rounded-lg border border-[#6F707E] bg-[#52535C] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#5A5B64] tablet:h-9 tablet:rounded-xl tablet:px-4 tablet:py-2.5 tablet:text-sm'
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
            )}
        >
            <span className={`inline-flex items-baseline ${className}`}>
                {children}
            </span>
        </Tippy>
    );
};
