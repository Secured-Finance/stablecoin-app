interface TabOption {
    key: string;
    label: string;
    disabled?: boolean;
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
            {tabs.map(tab => {
                const isTabDisabled = disabled || tab.disabled;
                return (
                    <button
                        key={tab.key}
                        className={`flex-1 rounded-xl py-2 font-medium ${
                            activeTab === tab.key
                                ? 'border border-neutral-9 bg-white text-neutral-900'
                                : 'bg-neutral-150 text-neutral-450'
                        } ${
                            isTabDisabled
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer'
                        }`}
                        onClick={() =>
                            !isTabDisabled && setActiveTab(tab.key as T)
                        }
                        disabled={isTabDisabled}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
