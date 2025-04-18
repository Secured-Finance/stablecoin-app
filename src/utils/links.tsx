import GitBook from 'src/assets/icons/gitbook.svg';
import SF from 'src/assets/icons/sf-logo-light.svg';
import { Icon } from 'src/components/Icon';
import { DOCUMENTATION_LINK } from 'src/constants';

type MoreLink = {
    text: string;
    href: string;
    isExternal: boolean;
    icon?: React.ReactNode;
};

export const LinkList: MoreLink[] = [
    {
        text: 'Redemption',
        href: '/redemption',
        isExternal: false,
    },
    {
        text: 'Official Site',
        href: 'https://secured.finance/',
        icon: (
            <div className='flex items-center justify-center'>
                <SF className='h-4 w-4 rounded-full' />
            </div>
        ),
        isExternal: true,
    },
    {
        text: 'Documentation',
        href: DOCUMENTATION_LINK,
        icon: (
            <div className='flex items-center justify-center'>
                <GitBook className='h-4 w-4' />
            </div>
        ),
        isExternal: true,
    },
    {
        text: 'Articles on Medium',
        href: 'https://blog.secured.finance/',
        icon: (
            <div className='flex items-center justify-center'>
                <Icon name='medium' className='h-4 w-4' />
            </div>
        ),
        isExternal: true,
    },
    {
        text: 'Follow us on X',
        href: 'https://x.com/USDFC_Protocol',
        icon: (
            <div className='flex items-center justify-center'>
                <Icon name='x-twitter' className='h-4 w-4' />
            </div>
        ),
        isExternal: true,
    },
    {
        text: 'Join us on Discord',
        href: 'https://discord.gg/3kytCrv3qY',
        icon: (
            <div className='flex items-center justify-center'>
                <Icon name='discord' className='h-4 w-4' />
            </div>
        ),
        isExternal: true,
    },
];
