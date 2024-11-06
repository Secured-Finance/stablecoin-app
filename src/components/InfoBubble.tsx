import InfoIconFill from 'src/assets/icons/information-circle-fill.svg';

export const InfoBubble: React.FC<React.PropsWithChildren> = ({ children }) => (
    <div className='typography-desktop-body-5 flex min-h-10 items-center gap-2 rounded-md border border-primary-300 bg-primary-500/10 px-2.5 py-1.5 text-neutral-900'>
        <InfoIconFill className='h-4 w-4 flex-shrink-0 text-primary-700' />
        <span>{children}</span>
    </div>
);
