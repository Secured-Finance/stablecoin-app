import React from 'react';
import { WalletCards, X, Check, ExternalLink } from 'lucide-react';

interface TransactionModalProps {
    isOpen: boolean;
    type: 'processing' | 'confirm' | 'confirmed' | 'failed';
    title: string;
    description: string;
    transactionHash?: string;
    onClose?: () => void;
    onViewTransaction?: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen,
    type,
    title,
    description,
    transactionHash,
    onClose,
    onViewTransaction,
}) => {
    if (!isOpen) return null;

    const truncateHash = (hash: string) => {
        if (!hash) return '';
        return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    };

    return (
        <div
            className='fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50'
            style={
                {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100vw',
                    height: '100vh',
                    minHeight: '100vh',
                    zIndex: 99999,
                } as React.CSSProperties
            }
        >
            <div className='shadow-xl relative flex w-[90vw] max-w-[500px] flex-col items-center gap-6 rounded-[20px] bg-white px-6 py-12 tablet:px-10'>
                {/* Close button - for confirmed and failed states */}
                {(type === 'confirmed' || type === 'failed') && onClose && (
                    <button
                        onClick={onClose}
                        className='absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200'
                    >
                        <X size={16} />
                    </button>
                )}

                {/* Icon/Spinner */}
                {type === 'processing' ? (
                    <div className='flex h-[120px] w-[120px] items-center justify-center'>
                        <svg
                            className='h-full w-full animate-spin'
                            viewBox='0 0 120 120'
                        >
                            <circle
                                className='stroke-current text-[#E6E8FF]'
                                strokeWidth='12'
                                fill='none'
                                r='50'
                                cx='60'
                                cy='60'
                            />
                            <circle
                                className='stroke-current text-[#5F6FFF]'
                                strokeWidth='12'
                                strokeDasharray='200'
                                strokeDashoffset='150'
                                strokeLinecap='round'
                                fill='none'
                                r='50'
                                cx='60'
                                cy='60'
                            />
                        </svg>
                    </div>
                ) : type === 'confirmed' ? (
                    <div className='flex h-[100px] w-[100px] items-center justify-center rounded-full bg-green-100'>
                        <Check
                            size={50}
                            className='text-green-600'
                            strokeWidth={3}
                        />
                    </div>
                ) : type === 'failed' ? (
                    <div className='flex h-[100px] w-[100px] items-center justify-center rounded-full bg-red-100'>
                        <X size={50} className='text-red-600' strokeWidth={3} />
                    </div>
                ) : (
                    <div className='flex h-[100px] w-[100px] items-center justify-center rounded-xl bg-[#E6E8FF]'>
                        <WalletCards size={40} className='text-[#5F6FFF]' />
                    </div>
                )}

                {/* Text Content */}
                <div className='flex w-full flex-col items-center gap-4 text-center'>
                    <h2 className='text-xl tablet:text-2xl font-semibold text-black'>
                        {title}
                    </h2>
                    <p className='max-w-[350px] text-sm leading-relaxed text-gray-700 tablet:max-w-[400px] tablet:text-base'>
                        {description}
                    </p>
                </div>

                {/* Waiting for Confirmation Button - for confirm type */}
                {type === 'confirm' && (
                    <div className='flex h-[48px] w-full max-w-[420px] items-center justify-center rounded-xl bg-gray-100 px-4 py-3'>
                        <span className='mr-2 text-sm text-gray-500 tablet:text-base'>
                            Waiting for Confirmation
                        </span>
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600'></div>
                    </div>
                )}

                {/* Transaction Hash Button - for confirmed state */}
                {type === 'confirmed' &&
                    transactionHash &&
                    onViewTransaction && (
                        <button
                            onClick={onViewTransaction}
                            className='flex h-[48px] w-full max-w-[420px] items-center justify-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 transition-colors hover:bg-green-100'
                        >
                            <span className='text-sm font-medium text-green-700 tablet:text-base'>
                                {truncateHash(transactionHash)}
                            </span>
                            <ExternalLink
                                size={16}
                                className='text-green-600'
                            />
                        </button>
                    )}

                {/* View on Explorer Button - for processing state */}
                {type === 'processing' &&
                    transactionHash &&
                    onViewTransaction && (
                        <button
                            onClick={onViewTransaction}
                            className='flex h-[48px] w-full max-w-[420px] items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50'
                        >
                            <span className='text-sm font-medium text-black tablet:text-base'>
                                View on Explorer
                            </span>
                            <ExternalLink size={16} className='text-gray-600' />
                        </button>
                    )}

                {/* Close Button for Confirmed and Failed States */}
                {(type === 'confirmed' || type === 'failed') && onClose && (
                    <button
                        onClick={onClose}
                        className={`flex h-[48px] w-full max-w-[420px] items-center justify-center rounded-xl px-4 py-3 text-white transition-colors ${
                            type === 'confirmed'
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        <span className='text-sm font-medium tablet:text-base'>
                            Close
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};
