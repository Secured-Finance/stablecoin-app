export const Page = ({
    children,
    name,
}: {
    children: React.ReactNode;
    name?: string;
}) => {
    return (
        <div
            className='m-0 mx-auto mb-10 mt-14 flex w-full max-w-[1280px] flex-grow flex-col items-center px-5 pb-16 laptop:mt-16'
            data-testid={name}
        >
            {children}
        </div>
    );
};
