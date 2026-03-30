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
        <div className='relative mb-6 flex h-[59px] w-full items-start gap-0 rounded-[20px] bg-neutral-150 p-1'>
            {tabs.map(tab => {
                const isTabDisabled = disabled || tab.disabled;
                return (
                    <button
                        key={tab.key}
                        className={`flex h-[51px] flex-1 items-center justify-center rounded-xl font-primary text-4 font-semibold leading-[19px] ${
                            activeTab === tab.key
                                ? 'border border-neutral-175 bg-white text-neutral-900'
                                : 'border-none bg-transparent text-neutral-900'
                        } ${
                            isTabDisabled
                                ? 'cursor-default opacity-50'
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
