interface TabOption {
    key: string;
    label: string;
}

interface TabSwitcherProps<T extends string> {
    activeTab: T;
    setActiveTab: (tab: T) => void;
    disabled?: boolean;
    tabs: TabOption[];
}

export function TabSwitcher<T extends string>({
    activeTab,
    setActiveTab,
    disabled = false,
    tabs,
}: TabSwitcherProps<T>) {
    return (
        <div className='mb-6 flex gap-1 overflow-hidden rounded-xl border border-neutral-9 bg-neutral-150'>
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    className={`flex-1 rounded-xl py-2 font-medium text-neutral-450 ${
                        activeTab === tab.key
                            ? 'border border-neutral-9 bg-white'
                            : 'bg-neutral-150'
                    }`}
                    onClick={() => setActiveTab(tab.key as T)}
                    disabled={disabled}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
