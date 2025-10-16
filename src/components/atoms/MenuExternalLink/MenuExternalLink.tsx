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
            className='flex h-[43px] w-[170px] cursor-pointer items-center justify-between gap-0.5 px-6 py-3 hover:bg-neutral-100 focus:outline-none'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Menu Item'
            data-cy={formatDataCy(text)}
        >
            <p
                className={clsx(
                    'typography-desktop-body-5 text-left text-4 text-neutral-800'
                )}
            >
                {text}
            </p>
            {icon && (
                <div className='flex h-5 w-5 shrink-0 items-center justify-center'>
                    {icon}
                </div>
            )}
        </Link>
    );
};
