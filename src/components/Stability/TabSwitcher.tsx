import { TabSwitcher as UniversalTabSwitcher } from 'src/components/atoms';

export function TabSwitcher({
    activeTab,
    setActiveTab,
    disabled,
}: {
    activeTab: 'deposit' | 'withdraw';
    setActiveTab: (tab: 'deposit' | 'withdraw') => void;
    disabled: boolean;
}) {
    const tabs = [
        { key: 'deposit', label: 'Deposit' },
        { key: 'withdraw', label: 'Withdraw' },
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
