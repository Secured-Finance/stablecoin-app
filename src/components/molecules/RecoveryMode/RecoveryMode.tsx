interface RecoveryModeProps {
    isActive: boolean;
}

export function RecoveryMode({ isActive }: RecoveryModeProps) {
    return (
        <div>
            <div className='mb-2 flex items-center justify-between'>
                <h3 className='font-primary text-4 font-medium'>
                    Recovery Mode
                </h3>
                <div className='flex items-center gap-2 rounded-2xl border-success-100 bg-success-50 px-2 py-1.5'>
                    <div
                        className={`h-3 w-3 rounded-3xl ${
                            isActive ? 'bg-red-500' : 'bg-[#84fa86]'
                        }`}
                    ></div>
                    <span
                        className={
                            'font-primary text-3.5 font-medium text-[#023103]'
                        }
                    >
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
            <p className='font-primary text-sm/4 font-normal text-secondary-400 '>
                Activated when the system&apos;s collateral ratio falls below
                150%, <br /> restricting borrowing and requiring repayments to
                restore stability.
            </p>
        </div>
    );
}
