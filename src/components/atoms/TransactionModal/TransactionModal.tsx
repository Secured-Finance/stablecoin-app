import React, { useEffect } from 'react';
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

    return (
        <div
            className='fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50'
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 99999,
            }}
        >
            <div className='shadow-xl relative flex w-[90vw] max-w-[500px] flex-col items-center gap-6 rounded-[20px] bg-white px-6 py-12 tablet:px-10'>
                {/* Icon/Spinner */}
                {type === 'processing' ? (
                    <div className='flex h-[120px] w-[120px] items-center justify-center'>
                        <div
                            className='h-[120px] w-[120px] animate-spin rounded-full border-[12px] border-[#E6E8FF]'
                            style={{
                                borderTopColor: '#5F6FFF',
                            }}
                        />
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
                    <h2 className='text-xl font-semibold text-black tablet:text-2xl'>
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

                {/* Transaction Hash for Processing */}
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

                {/* Buttons for Confirmed */}
                {type === 'confirmed' && (
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
                )}

                {/* Close Button for Failed */}
                {type === 'failed' && onClose && (
                    <button
                        onClick={onClose}
                        className='flex h-[48px] w-full max-w-[420px] items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-white transition-colors hover:bg-red-700'
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
