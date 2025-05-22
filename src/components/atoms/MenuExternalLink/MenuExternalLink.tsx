import clsx from 'clsx';
import Link from 'next/link';
import { formatDataCy } from 'src/utils';

export const MenuExternalLink = ({
    text,
    icon,
    link,
}: {
    text: string;
    icon?: React.ReactNode;
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
                <p
                    className={clsx(
                        'typography-desktop-body-5 grow text-left text-neutral-800'
                    )}
                >
                    {text}
                </p>
                {icon && (
                    <div className='flex h-5 w-5 items-center justify-center'>
                        {icon}
                    </div>
                )}
            </div>
        </Link>
    );
};
