export function TabSwitcher({
    activeTab,
    setActiveTab,
    disabled,
}: {
    activeTab: 'deposit' | 'withdraw';
    setActiveTab: (tab: 'deposit' | 'withdraw') => void;
    disabled: boolean;
}) {
    return (
        <div className='mb-6 flex gap-1 overflow-hidden rounded-xl border border-[#e3e3e3] bg-[#F5f5f5]'>
            <button
                className={`flex-1 rounded-xl py-2 font-medium text-[#565656] ${
                    activeTab === 'deposit'
                        ? 'border border-[#E3E3E3] bg-white'
                        : 'bg-[#F5f5f5]'
                }`}
                onClick={() => setActiveTab('deposit')}
                disabled={disabled}
            >
                Deposit
            </button>
            <button
                className={`flex-1 rounded-xl py-2 font-medium text-[#565656] ${
                    activeTab === 'withdraw'
                        ? 'border border-[#E3E3E3] bg-white'
                        : 'bg-[#F5f5f5]'
                }`}
                onClick={() => setActiveTab('withdraw')}
                disabled={disabled}
            >
                Withdraw
            </button>
        </div>
    );
}
