import { ArrowUpRight } from 'lucide-react';
import { DOCUMENTATION_LINK } from 'src/constants';

type MoreLink = {
    text: string;
    href: string;
    isExternal: boolean;
    icon?: React.ReactNode;
};

export const LinkList: MoreLink[] = [
    {
        text: 'Risky Troves',
        href: '/risky-troves',
        isExternal: false,
    },
    {
        text: 'Redeem USDFC',
        href: '/redemption',
        isExternal: false,
    },
    {
        text: 'Bridge',
        href: '/bridge',
        isExternal: false,
    },
    {
        text: 'Lend USDFC',
        href: 'https://app.secured.finance/',
        icon: <ArrowUpRight className='h-5 w-5 rounded-full' />,
        isExternal: true,
    },
    {
        text: 'Docs',
        href: DOCUMENTATION_LINK,
        icon: <ArrowUpRight className='h-5 w-5' />,
        isExternal: true,
    },
];
