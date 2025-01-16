import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MenuPopover } from 'src/components/molecules';
import { LINKS } from 'src/constants';

export const Nav: React.FC = () => {
    const { pathname } = useRouter();

    return (
        <div className='hidden laptop:flex'>
            {LINKS.map(link => (
                <Link
                    key={link.to}
                    href={link.to}
                    className={clsx(
                        'px-4 text-3.5 leading-6 text-neutral-800',
                        {
                            'font-semibold text-primary-500':
                                pathname === link.to,
                        }
                    )}
                >
                    {link.label}
                </Link>
            ))}
            <MenuPopover />
        </div>
    );
};
