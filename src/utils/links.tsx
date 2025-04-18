import { IconName } from '@fortawesome/fontawesome-svg-core';
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
        icon: <SF className='h-5 w-5 rounded-full' />,
        isExternal: true,
    },
    {
        text: 'Documentation',
        href: DOCUMENTATION_LINK,
        icon: <GitBook className='h-5 w-5' />,
        isExternal: true,
    },
    {
        text: 'Articles on Medium',
        href: 'https://blog.secured.finance/',
        icon: <Icon name={'medium' as IconName} className='h-5 w-5' />,
        isExternal: true,
    },
    {
        text: 'Follow us on X',
        href: 'https://x.com/USDFC_Protocol',
        icon: <Icon name={'x-twitter' as IconName} className='h-5 w-5' />,
        isExternal: true,
    },
    {
        text: 'Join us on Discord',
        href: 'https://discord.gg/3kytCrv3qY',
        icon: <Icon name={'discord' as IconName} className='h-5 w-5' />,
        isExternal: true,
    },
];
