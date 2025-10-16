import React, { useEffect, ReactNode } from 'react';
import {
    AlertTriangle,
    Check,
    ExternalLink,
    LucideIcon,
    WalletCards,
    X,
} from 'lucide-react';
import { Button, ButtonVariants } from 'src/components/atoms';

type StatusType =
    | 'processing'
    | 'confirm'
    | 'confirmed'
    | 'failed'
    | 'warning'
    | 'info';

interface StatusConfig {
    icon: LucideIcon | 'spinner';
    iconBgClass: string;
    iconClass: string;
    iconSize?: number;
}

const statusConfigs: Record<StatusType, StatusConfig> = {
    processing: {
        icon: 'spinner',
        iconBgClass: '',
        iconClass: '',
    },
    confirm: {
        icon: WalletCards,
        iconBgClass: 'bg-[#E6E8FF]',
        iconClass: 'text-[#5F6FFF]',
        iconSize: 40,
    },
    confirmed: {
        icon: Check,
        iconBgClass: 'bg-green-100',
        iconClass: 'text-green-600',
        iconSize: 50,
    },
    failed: {
        icon: X,
        iconBgClass: 'bg-red-100',
        iconClass: 'text-red-600',
        iconSize: 50,
    },
    warning: {
        icon: AlertTriangle,
        iconBgClass: 'bg-orange-100',
        iconClass: 'text-orange-600',
        iconSize: 50,
    },
    info: {
        icon: WalletCards,
        iconBgClass: 'bg-blue-100',
        iconClass: 'text-blue-600',
        iconSize: 40,
    },
};

interface DetailItem {
    label: string;
    value: string;
    valueClassName?: string;
}

interface ActionButton {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

export interface StatusModalProps {
    isOpen: boolean;
    type: StatusType;
    title: string;
    description: string | ReactNode;
    details?: DetailItem[];
    detailsClassName?: string;
    transactionHash?: string;
    onViewTransaction?: () => void;
    onClose?: () => void;
    customActions?: ActionButton[];
    showWaitingIndicator?: boolean;
}

export const StatusModal: React.FC<StatusModalProps> = ({
    isOpen,
    type,
    title,
    description,
    details,
    detailsClassName,
    transactionHash,
    onViewTransaction,
    onClose,
    customActions,
    showWaitingIndicator = false,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const config = statusConfigs[type];
    const IconComponent = config.icon !== 'spinner' ? config.icon : null;

    const renderDefaultActions = () => {
        if (customActions) {
            return (
                <div className='flex w-full max-w-[420px] flex-col gap-3'>
                    {customActions.map((action, index) => (
                        <Button
                            key={index}
                            variant={
                                action.variant === 'secondary'
                                    ? ButtonVariants.secondary
                                    : ButtonVariants.primary
                            }
                            onClick={action.onClick}
                            disabled={action.disabled || action.loading}
                            className={action.className || 'h-[48px] w-full'}
                        >
                            <span className='text-sm font-medium tablet:text-base'>
                                {action.loading ? 'Loading...' : action.label}
                            </span>
                        </Button>
                    ))}
                </div>
            );
        }

        // Default actions based on type
        if (type === 'confirm' && showWaitingIndicator) {
            return (
                <div className='flex h-[48px] w-full max-w-[420px] items-center justify-center rounded-xl bg-gray-100 px-4 py-3'>
                    <span className='mr-2 text-sm text-gray-500 tablet:text-base'>
                        Waiting for Confirmation
                    </span>
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600'></div>
                </div>
            );
        }

        if (type === 'processing' && transactionHash && onViewTransaction) {
            return (
                <button
                    onClick={onViewTransaction}
                    className='flex h-[48px] w-full max-w-[420px] items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50'
                >
                    <span className='text-sm font-medium text-black tablet:text-base'>
                        View on Explorer
                    </span>
                    <ExternalLink size={16} className='text-gray-600' />
                </button>
            );
        }

        if (type === 'confirmed') {
            return (
                <div className='flex w-full max-w-[420px] flex-col gap-3'>
                    {transactionHash && onViewTransaction && (
                        <button
                            onClick={onViewTransaction}
                            className='flex h-[48px] w-full items-center justify-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 transition-colors hover:bg-green-100'
                        >
                            <span className='text-sm font-medium text-green-700 tablet:text-base'>
                                View on Explorer
                            </span>
                            <ExternalLink
                                size={16}
                                className='text-green-600'
                            />
                        </button>
                    )}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className='flex h-[48px] w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700'
                        >
                            <span className='text-sm font-medium tablet:text-base'>
                                Close
                            </span>
                        </button>
                    )}
                </div>
            );
        }

        if (type === 'failed' && onClose) {
            return (
                <button
                    onClick={onClose}
                    className='flex h-[48px] w-full max-w-[420px] items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-white transition-colors hover:bg-red-700'
                >
                    <span className='text-sm font-medium tablet:text-base'>
                        Close
                    </span>
                </button>
            );
        }

        return null;
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='shadow-xl relative flex w-[90vw] max-w-[500px] flex-col items-center gap-6 rounded-[20px] bg-white px-6 py-12 tablet:px-10'>
                {/* Icon/Spinner */}
                {config.icon === 'spinner' ? (
                    <div className='flex h-[120px] w-[120px] items-center justify-center'>
                        <div
                            className='h-[120px] w-[120px] animate-spin rounded-full border-[12px] border-[#E6E8FF]'
                            style={{
                                borderTopColor: '#5F6FFF',
                            }}
                        />
                    </div>
                ) : IconComponent ? (
                    <div
                        className={`flex h-[100px] w-[100px] items-center justify-center ${
                            type === 'confirm' || type === 'info'
                                ? 'rounded-xl'
                                : 'rounded-full'
                        } ${config.iconBgClass}`}
                    >
                        <IconComponent
                            size={config.iconSize || 50}
                            className={config.iconClass}
                            strokeWidth={
                                type === 'confirm' || type === 'info' ? 2 : 3
                            }
                        />
                    </div>
                ) : null}

                {/* Text Content */}
                <div className='flex w-full flex-col items-center gap-4 text-center'>
                    <h2 className='text-xl font-semibold text-black tablet:text-2xl'>
                        {title}
                    </h2>
                    {typeof description === 'string' ? (
                        <p className='max-w-[350px] text-sm leading-relaxed text-gray-700 tablet:max-w-[400px] tablet:text-base'>
                            {description}
                        </p>
                    ) : (
                        <div className='max-w-[350px] tablet:max-w-[400px]'>
                            {description}
                        </div>
                    )}
                </div>

                {/* Details Section */}
                {details && details.length > 0 && (
                    <div
                        className={`w-full max-w-[420px] rounded-xl border px-4 py-4 ${
                            detailsClassName || 'border-gray-200 bg-gray-50'
                        }`}
                    >
                        <div className='flex flex-col gap-3 text-sm'>
                            {details.map((detail, index) => (
                                <div
                                    key={index}
                                    className='flex justify-between'
                                >
                                    <span className='text-gray-600'>
                                        {detail.label}
                                    </span>
                                    <span
                                        className={
                                            detail.valueClassName ||
                                            'font-medium text-gray-900'
                                        }
                                    >
                                        {detail.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {renderDefaultActions()}
            </div>
        </div>
    );
};
