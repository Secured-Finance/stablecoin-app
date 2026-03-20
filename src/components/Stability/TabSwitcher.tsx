import { TabSwitcher as UniversalTabSwitcher } from 'src/components/atoms';

export function TabSwitcher({
    activeTab,
    setActiveTab,
    disabled,
    hasDeposit = true,
}: {
    activeTab: 'deposit' | 'withdraw';
    setActiveTab: (tab: 'deposit' | 'withdraw') => void;
    disabled: boolean;
    hasDeposit?: boolean;
}) {
    const tabs = [
        { key: 'deposit', label: 'Deposit' },
        { key: 'withdraw', label: 'Withdraw', disabled: !hasDeposit },
    ];

    return (
        <UniversalTabSwitcher
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            disabled={disabled}
            tabs={tabs}
        />
    );
}
