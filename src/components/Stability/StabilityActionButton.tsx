import {
    Decimal,
    StabilityDepositChange,
} from '@secured-finance/stablecoin-lib-base';
import { COIN } from 'src/strings';

export function ActionButton({
    validChange,
    isDisabled,
    getButtonText,
    onClick,
    activeTab,
    isConnected,
    onConnectWallet,
}: {
    validChange: StabilityDepositChange<Decimal> | undefined;
    isDisabled: boolean;
    getButtonText: () => string;
    onClick: () => void;
    activeTab: 'deposit' | 'withdraw';
    isConnected: boolean;
    onConnectWallet: () => void;
}) {
    // If wallet not connected, show Connect Wallet button
    if (!isConnected) {
        return (
            <button
                className='mb-3 w-full rounded-xl bg-primary-500 py-3 font-medium text-white hover:bg-primary-700'
                onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onConnectWallet();
                }}
            >
                Connect Wallet
            </button>
        );
    }

    // If wallet connected but no valid change, show disabled button
    if (!validChange) {
        return (
            <button
                disabled
                className='mb-3 w-full cursor-default rounded-xl bg-neutral-250 py-3 text-white'
            >
                {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'} {COIN}
            </button>
        );
    }

    // If wallet connected and valid change, show action button
    return (
        <button
            className={`mb-3 w-full rounded-xl py-3 font-medium text-white ${
                isDisabled
                    ? 'cursor-default bg-gray-400'
                    : 'bg-primary-500 hover:bg-primary-700'
            }`}
            disabled={isDisabled}
            onClick={onClick}
        >
            {getButtonText()}
        </button>
    );
}
