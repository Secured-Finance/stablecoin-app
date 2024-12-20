import Link from 'next/link';
import { formatDataCy } from 'src/utils';

export const MenuItem = ({
    text,
    icon,
    link,
}: {
    text: string;
    icon: React.ReactNode;
    link: string;
}) => {
    return (
        <Link
            href={link}
            className='flex h-full w-full cursor-pointer items-center px-5 py-[11px] hover:bg-neutral-100 focus:outline-none'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Menu Item'
            data-cy={formatDataCy(text)}
        >
            <div className='flex w-full cursor-pointer items-center gap-2'>
                <div className='h-5 w-5'>{icon}</div>
                <p className='typography-desktop-body-5 text-neutral-800'>
                    {text}
                </p>
            </div>
        </Link>
    );
};
