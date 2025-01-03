import clsx from 'clsx';
import { t } from 'i18next';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
    HTMLAttributes,
    Ref,
    forwardRef,
    useRef,
    useState,
} from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import MenuIcon from 'src/assets/icons/menu.svg';
import XIcon from 'src/assets/icons/x.svg';
import { LINKS } from 'src/constants';
import { LinkList } from 'src/utils';
import { UrlObject } from 'url';
import { SecuredFinanceLogo } from './SecuredFinanceLogo';

export const SideNav: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const overlay = useRef<HTMLDivElement>(null);

    const { pathname } = useLocation();

    const handleOutsideClick = (
        e:
            | React.MouseEvent<HTMLDivElement, MouseEvent>
            | React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (e.target === overlay.current) {
            setIsVisible(false);
        }
    };

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className='flex items-center justify-center laptop:hidden'
            >
                <MenuIcon className='h-6 w-6' />
            </button>
        );
    }
    return (
        <div
            ref={overlay}
            tabIndex={0}
            className='fixed inset-0 z-50 h-screen w-screen bg-neutral-600/50 laptop:hidden'
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleOutsideClick(e);
                }
            }}
            role='button'
            onClick={handleOutsideClick}
        >
            <aside className='flex h-full w-3/4 min-w-[280px] flex-col gap-8 bg-neutral-50 p-4 shadow-sidenav'>
                <div className='flex items-center justify-between'>
                    <SecuredFinanceLogo />
                    <button onClick={() => setIsVisible(false)}>
                        <XIcon className='h-6 w-6 font-bold text-primary-500' />
                    </button>
                </div>

                <div className='flex flex-col items-start gap-4'>
                    {LINKS.map(link => {
                        return (
                            <NavLink
                                key={link.labelKey}
                                to={link.to}
                                className={clsx(
                                    'text-4.5 font-semibold leading-7 text-neutral-900',
                                    {
                                        'text-primary-500':
                                            pathname === link.to,
                                    }
                                )}
                                onClick={() => setIsVisible(false)}
                            >
                                {t(link.labelKey)}
                            </NavLink>
                        );
                    })}
                    <button
                        onClick={e => {
                            e.preventDefault();
                            setShowMore(!showMore);
                        }}
                        aria-label='Show More'
                        className={clsx(
                            'flex items-center justify-between gap-2 text-center text-4.5 font-semibold leading-7 text-neutral-900 focus:outline-none'
                        )}
                    >
                        {t('common.more')}
                        <ChevronRight
                            className={clsx('h-4 w-4 text-neutral-900', {
                                'rotate-90': showMore,
                            })}
                        />
                    </button>
                    {showMore && (
                        <div className='w-full px-4'>
                            {LinkList.map(link => (
                                <MobileItemLink
                                    key={link.textKey}
                                    textKey={link.textKey}
                                    href={link.href}
                                    onClick={() => setIsVisible(false)}
                                    target='_blank'
                                />
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
};

const NextLink = forwardRef(
    (
        props: HTMLAttributes<HTMLAnchorElement> & {
            href: string | UrlObject;
            target?: string;
        },
        ref: Ref<HTMLAnchorElement>
    ) => {
        const { href, children, ...rest } = props;
        return (
            <Link href={href} {...rest} ref={ref}>
                {children}
            </Link>
        );
    }
);
NextLink.displayName = 'NextLink';

const MobileItemLink = ({
    textKey,
    href,
    onClick,
    target,
}: {
    textKey: string;
    href: string;
    onClick: () => void;
    target?: string;
}) => {
    const router = useRouter();
    const isActive = router.pathname === href;
    return (
        <NextLink
            className={clsx(
                'flex w-full cursor-pointer flex-row items-center justify-start whitespace-nowrap pb-2 text-center text-4.5 font-semibold leading-7 text-neutral-900',
                { underline: isActive }
            )}
            href={href}
            target={target}
            rel='noreferrer'
            onClick={onClick}
        >
            {t(textKey)}
        </NextLink>
    );
};
