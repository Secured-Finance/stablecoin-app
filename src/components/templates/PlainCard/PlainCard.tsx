export const PlainCard = ({
    title,
    children,
}: {
    title: React.ReactNode;
    children: React.ReactNode;
}) => {
    return (
        <div className='flex flex-col rounded-lg bg-neutral-50 shadow-card'>
            <div className='px-3 pt-3 laptop:px-4 laptop:pt-4'>
                <h2 className='typography-mobile-body-1 flex items-center justify-between font-light text-neutral-800'>
                    {title}
                </h2>
            </div>
            <div className='flex flex-col gap-3 px-3 pb-3 pt-3 laptop:px-4 laptop:pb-4'>
                <div>{children}</div>
            </div>
        </div>
    );
};
