interface RecoveryModeProps {
    isActive: boolean;
}

export function RecoveryMode({ isActive }: RecoveryModeProps) {
    return (
        <div>
            <div className='mb-2 flex items-center justify-between'>
                <h3 className='font-medium'>Recovery Mode</h3>
                <div className='flex items-center gap-2 rounded-2xl border-[#C9FDCA] bg-[#DFFEE0] p-2'>
                    <div
                        className={`h-3 w-3 rounded-full ${
                            isActive ? 'bg-red-500' : 'bg-[#84fa86]'
                        }`}
                    ></div>
                    <span className={'font-primary text-[#023103]'}>
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
            <p className='font-primary text-sm/4 font-normal text-[#565656] '>
                Activated when the system&apos;s collateral ratio falls below
                150%, <br /> restricting borrowing and requiring repayments to
                restore stability.
            </p>
        </div>
    );
}
