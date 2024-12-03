import GitBook from 'src/assets/icons/gitbook.svg';

type MoreLink = {
    textKey: string;
    href: string;
    icon: React.ReactNode;
};

export const LinkList: MoreLink[] = [
    {
        textKey: 'common.documentation',
        href: 'https://docs.secured.finance/stablecoin-protocol-guide/',
        icon: <GitBook className='h-4 w-4 text-white' />,
    },
];
