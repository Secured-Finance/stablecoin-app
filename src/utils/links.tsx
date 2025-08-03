import { ArrowUpRight } from 'lucide-react';
import { DOCUMENTATION_LINK } from 'src/constants';
import { getFixedIncomeMarketLink } from 'src/utils';

type MoreLink = {
    text: string;
    href: string;
    isExternal: boolean;
    icon?: React.ReactNode;
};

export const getLinkList = (): MoreLink[] => [
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
        href: getFixedIncomeMarketLink(),
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
