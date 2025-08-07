interface LinkButtonProps {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
}

export const LinkButton = ({
    leftIcon,
    rightIcon,
    onClick,
    disabled,
    children,
    className = '',
}: LinkButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center font-primary text-sm font-semibold normal-case text-black-70 disabled:text-gray-300 ${
                className || ''
            }`}
        >
            {leftIcon && <span className='mr-1'>{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className='ml-1'>{rightIcon}</span>}
        </button>
    );
};
