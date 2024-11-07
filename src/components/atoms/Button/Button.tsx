import clsx from 'clsx';
import { useBreakpoint } from 'src/hooks';
import { SvgIcon } from 'src/types';
import { sizeStyle, textStyle, variantStyle } from './constants';
import { ButtonSizes, ButtonVariants } from './types';

export const Button = ({
    href,
    size = ButtonSizes.md,
    fullWidth = false,
    children,
    StartIcon,
    EndIcon,
    variant = ButtonVariants.primary,
    mobileText,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        fullWidth?: boolean;
        href?: string;
        size?: ButtonSizes;
        variant?: ButtonVariants;
        mobileText?: string;
    } & {
        StartIcon?: SvgIcon;
        EndIcon?: SvgIcon;
    }) => {
    const isMobile = useBreakpoint('laptop');
    const Tag = href ? 'a' : 'button';
    const tagProps = href
        ? {
              href,
              target: '_blank',
              rel: 'noopener noreferrer',
          }
        : props;

    const label = typeof children === 'string' ? children : 'Button';
    const text = isMobile && mobileText ? mobileText : children;

    return (
        <Tag
            {...tagProps}
            aria-label={label}
            className={clsx(
                'flex items-center justify-center border font-semibold',
                props?.className,
                sizeStyle[size],
                variantStyle[variant],
                {
                    'disabled:border-0': variant === ButtonVariants.primary,
                    'w-full': fullWidth,
                    'w-fit': !fullWidth,
                }
            )}
        >
            {/* TODO: handle height of start and end icon wrt size prop value */}
            {StartIcon && (
                <span className='mr-1.5'>
                    <StartIcon className='h-4 w-4' role='img' />
                </span>
            )}
            <p className={clsx('whitespace-nowrap', textStyle[size])}>{text}</p>
            {EndIcon && (
                <span className='ml-1.5'>
                    <EndIcon className='h-4 w-4' role='img' />
                </span>
            )}
        </Tag>
    );
};
