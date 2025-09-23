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
}: {
    validChange: StabilityDepositChange<Decimal> | undefined;
    isDisabled: boolean;
    getButtonText: () => string;
    onClick: () => void;
    activeTab: 'deposit' | 'withdraw';
}) {
    return validChange ? (
        <button
            className={`mb-3 w-full rounded-xl py-3 font-medium text-white ${
                isDisabled
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-primary-500 hover:bg-primary-700'
            }`}
            disabled={isDisabled}
            onClick={onClick}
        >
            {getButtonText()}
        </button>
    ) : (
        <button
            disabled
            className='mb-3 w-full cursor-not-allowed rounded-xl bg-neutral-250 py-3 text-white'
        >
            {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'} {COIN}
        </button>
    );
}
