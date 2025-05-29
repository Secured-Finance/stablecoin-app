import Link from 'next/link';
import SecuredFinanceLogo from 'src/assets/icons/sflogo.svg';
import { Icon } from './Icon';
import { SOCIAL_LINKS } from 'src/constants';
import { IconName } from '@fortawesome/fontawesome-svg-core';

export const Footer = () => {
    return (
        <footer className='border-t-[0.5px] border-neutral-9 px-6 py-7'>
            <div className='flex items-center justify-between gap-4 tablet:flex-col laptop:flex-row'>
                <div className='flex items-center gap-2'>
                    <span className='text-sm text-secondary-400'>Built by</span>
                    <SecuredFinanceLogo className='h-[16px] w-[160px]' />
                </div>

                <div className='flex items-center gap-6'>
                    {SOCIAL_LINKS.map(
                        ({ href, iconName, ariaLabel }, index) => (
                            <Link
                                key={index}
                                href={href}
                                aria-label={ariaLabel}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <Icon
                                    name={iconName as IconName}
                                    className='h-4 w-4'
                                />
                            </Link>
                        )
                    )}
                </div>
            </div>
        </footer>
    );
};
