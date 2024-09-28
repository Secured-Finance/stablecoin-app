export const Layout = ({
    navBar,
    children,
    footer,
}: {
    navBar: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
}) => {
    return (
        <div
            className='flex h-screen w-full flex-grow flex-col justify-between gap-8'
            data-testid='wrapper-div'
        >
            <div className='w-full'>
                <header className='sticky top-0 z-30 w-full'>{navBar}</header>
                <main className='h-full w-full'>{children}</main>
            </div>
            <footer className='sticky bottom-0 z-30 w-full bg-neutral-900'>
                {footer}
            </footer>
        </div>
    );
};
