import GitBook from 'src/assets/icons/gitbook.svg';
import SF from 'src/assets/icons/sf-logo-light.svg';

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
        href: 'https://docs.secured.finance/stablecoin-protocol-guide/',
        icon: <GitBook className='h-5 w-5' />,
        isExternal: true,
    },
    {
        text: 'Articles on Medium',
        href: 'https://blog.secured.finance/',
        icon: <GitBook className='h-5 w-5' />,
        isExternal: true,
    },
    {
        text: 'Follow us on Twitter',
        href: 'https://twitter.com/Secured_Fi',
        icon: <GitBook className='h-5 w-5' />,
        isExternal: true,
    },
    {
        text: 'Join us on Discord',
        href: 'https://discord.gg/3kytCrv3qY',
        icon: <GitBook className='h-5 w-5' />,
        isExternal: true,
    },
];
