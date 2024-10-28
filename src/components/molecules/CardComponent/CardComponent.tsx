export const CardComponent = ({
    title,
    children,
    actionComponent,
}: {
    title: React.ReactNode;
    children: React.ReactNode;
    actionComponent?: React.ReactNode;
}) => {
    return (
        <div className='mt-8 flex flex-col rounded-b-xl bg-neutral-50 drop-shadow-sm'>
            <div className='h-10 border-t-2 border-primary-500 bg-neutral-200 px-3.5 py-2 text-3.5 font-semibold leading-[22px] text-neutral-900 laptop:h-[42px] laptop:border-t-4 laptop:text-base'>
                <h2 className='flex items-center justify-between'>{title}</h2>
            </div>
            <div className='flex flex-col gap-2 px-3 pb-3 pt-3 laptop:gap-3 laptop:px-4 laptop:pb-4'>
                {children}
                {actionComponent && (
                    <div className='flex justify-end gap-2'>
                        {actionComponent}
                    </div>
                )}
            </div>
        </div>
    );
};
