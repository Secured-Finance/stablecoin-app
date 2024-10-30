export const PlainCard = ({
    title,
    children,
}: {
    title: React.ReactNode;
    children: React.ReactNode;
}) => {
    return (
        <div className='flex flex-col rounded-b-xl bg-neutral-50 text-neutral-900 drop-shadow-sm'>
            <div className='h-10 border-t-2 border-primary-500  px-3 py-2 text-3.5 font-semibold leading-5.5 tablet:border-t-4 laptop:h-[42px] laptop:px-3.5 laptop:text-base'>
                <h2 className='flex items-center justify-between'>{title}</h2>
            </div>
            <div className='flex flex-col gap-3 px-3 pb-3 laptop:px-4 laptop:pb-4'>
                <div>{children}</div>
            </div>
        </div>
    );
};
