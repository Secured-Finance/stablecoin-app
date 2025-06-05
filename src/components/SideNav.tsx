import clsx from 'clsx';
import Link from 'next/link';
import React, {
    HTMLAttributes,
    Ref,
    forwardRef,
    useRef,
    useState,
} from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ArrowDownSimple from 'src/assets/icons/arrow-down-simple.svg';
import MenuIcon from 'src/assets/icons/menu.svg';
import XIcon from 'src/assets/icons/x.svg';
import { LINKS, NETWORK_LINKS } from 'src/constants';
import { getCurrentNetworkKey, LinkList } from 'src/utils';
import { UrlObject } from 'url';
import { SecuredFinanceLogo } from './SecuredFinanceLogo';

export const SideNav: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const overlay = useRef<HTMLDivElement>(null);

    const { pathname } = useLocation();
    const currentKey = getCurrentNetworkKey();
    const availableNetworks = Object.values(NETWORK_LINKS).filter(
        net => net.key !== currentKey
    );

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
                    {LINKS.map(link => (
                        <NavLink
                            key={link.label}
                            to={link.to}
                            className={clsx(
                                'text-4.5 font-semibold leading-7 text-neutral-900',
                                {
                                    'text-primary-500': pathname === link.to,
                                }
                            )}
                            onClick={() => setIsVisible(false)}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <button
                        onClick={e => {
                            e.preventDefault();
                            setShowMore(!showMore);
                        }}
                        aria-label='Show More'
                        className={clsx(
                            'flex items-center justify-between gap-1 text-center text-4.5 font-semibold leading-7 text-neutral-900 focus:outline-none'
                        )}
                    >
                        More
                        <ArrowDownSimple
                            className={clsx(
                                'h-6 w-6 text-neutral-600 transition',
                                {
                                    'rotate-180': showMore,
                                }
                            )}
                        />
                    </button>
                    {showMore && (
                        <div className='w-full'>
                            <div className='flex gap-2 px-3 py-[11px] laptop:hidden'>
                                {availableNetworks.map(
                                    ({ key, label, href }) => (
                                        <a key={key} href={href}>
                                            <span className='typography-desktop-body-3 font-semibold text-neutral-800'>
                                                {label}
                                            </span>
                                        </a>
                                    )
                                )}
                            </div>

                            {LinkList.map(link =>
                                link.isExternal ? (
                                    <MobileItemExternalLink
                                        key={link.text}
                                        text={link.text}
                                        icon={link.icon}
                                        link={link.href}
                                        onClick={() => setIsVisible(false)}
                                    />
                                ) : (
                                    <MobileItemLink
                                        key={link.text}
                                        text={link.text}
                                        label={link.text}
                                        link={link.href}
                                        onClick={() => setIsVisible(false)}
                                        isActive={pathname === link.href}
                                    />
                                )
                            )}
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

const MobileItemExternalLink = ({
    text,
    icon,
    link,
    onClick,
}: {
    text: string;
    icon?: React.ReactNode;
    link: string;
    onClick: () => void;
}) => {
    return (
        <NextLink
            className={clsx(
                'flex w-full cursor-pointer items-center px-3 py-[11px] focus:outline-none'
            )}
            href={link}
            target='_blank'
            rel='noreferrer'
            onClick={onClick}
        >
            <div className='flex w-full cursor-pointer items-center gap-2'>
                {icon && (
                    <div className='flex h-5 w-5 items-center justify-center'>
                        {icon}
                    </div>
                )}
                <p className='typography-desktop-body-3 font-semibold text-neutral-800'>
                    {text}
                </p>
            </div>
        </NextLink>
    );
};

const MobileItemLink = ({
    text,
    label,
    link,
    onClick,
    isActive,
}: {
    text: string;
    label: string;
    link: string;
    onClick: () => void;
    isActive: boolean;
}) => {
    return (
        <NavLink
            key={label}
            to={link}
            className='flex w-full cursor-pointer items-center px-3 py-[11px] focus:outline-none'
            onClick={onClick}
        >
            <div className='flex w-full cursor-pointer items-center gap-2'>
                <p
                    className={clsx(
                        'typography-desktop-body-3 font-semibold text-neutral-800',
                        { 'text-primary-500': isActive }
                    )}
                >
                    {text}
                </p>
            </div>
        </NavLink>
    );
};
