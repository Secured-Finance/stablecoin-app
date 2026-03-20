interface RecoveryModeProps {
    isActive: boolean;
}

export const RecoveryMode = ({ isActive }: RecoveryModeProps) => {
    return (
        <div className='flex flex-col items-start gap-4 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-0'>
            <div className='flex min-h-[65px] w-full flex-col items-start justify-center gap-1.5 tablet:w-[440px]'>
                <h3 className='font-primary text-4 font-medium leading-[19px] text-neutral-450'>
                    Recovery Mode
                </h3>
                <p className='font-primary text-sm font-normal leading-[140%] text-neutral-450'>
                    Activated when the system&apos;s collateral ratio falls
                    below 150%, restricting borrowing and requiring repayments
                    to restore stability.
                </p>
            </div>
            <div className='flex items-center gap-1 rounded-2xl border-success-100 bg-success-50 px-2 py-1.5'>
                <div
                    className={`h-3 w-3 rounded-3xl ${
                        isActive ? 'bg-red-500' : 'bg-success-500'
                    }`}
                ></div>
                <span
                    className={
                        'font-primary text-3.5 font-medium text-success-700'
                    }
                >
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
        </div>
    );
};
