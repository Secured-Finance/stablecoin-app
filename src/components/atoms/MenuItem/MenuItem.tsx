import Link from 'next/link';
import { formatDataCy } from 'src/utils';

export const MenuItem = ({
    text,
    icon,
    link,
    badge,
}: {
    text: string;
    icon: React.ReactNode;
    link: string;
    badge: React.ReactNode;
}) => {
    return (
        <div
            data-cy={formatDataCy(text)}
            className='group flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 hover:bg-neutral-600 focus:outline-none'
        >
            <Link
                href={link}
                className='flex h-full w-full'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Menu Item'
            >
                <div className='flex w-full cursor-pointer items-center justify-between'>
                    <div className='flex items-center gap-2.5'>
                        <div className='h-4 w-4'>{icon}</div>
                        <p className='typography-mobile-body-5 text-white'>
                            {text}
                        </p>
                    </div>
                    <span className='hidden group-hover:block'>{badge}</span>
                </div>
            </Link>
        </div>
    );
};
