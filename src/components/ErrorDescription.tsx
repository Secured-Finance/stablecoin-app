import AlertIcon from 'src/assets/icons/alert-fill.svg';

export const ErrorDescription: React.FC<React.PropsWithChildren> = ({
    children,
}) => (
    <div className='typography-desktop-body-5 flex min-h-10 items-center gap-2 rounded-md border border-error-300 bg-error-500/10 px-2.5 py-1.5 text-neutral-900'>
        <AlertIcon className='h-4 w-4 text-error-700' />
        <span>{children}</span>
    </div>
);
