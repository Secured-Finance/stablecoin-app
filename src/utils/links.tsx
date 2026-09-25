import { ArrowUpRight } from 'lucide-react';
import { USDFC_DOCS_BASE } from 'src/constants';
import { getFixedIncomeMarketLink, getLegacyUSDFCLink } from './strings';

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
        href: USDFC_DOCS_BASE,
        icon: <ArrowUpRight className='h-5 w-5' />,
        isExternal: true,
    },
    {
        text: 'Legacy UI',
        href: getLegacyUSDFCLink(),
        icon: <ArrowUpRight className='h-5 w-5' />,
        isExternal: true,
    },
];
