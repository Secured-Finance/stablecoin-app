import Link from 'next/link';
import {
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from 'src/components/ui';
import { currencyMap, CurrencySymbol } from 'src/utils';

interface CoinDetailsCardProps {
    currency: {
        NAME: string;
    };
}

const details = [
    {
        label: 'Mint Fee',
        value: '0.00%',
        content: '',
    },
    {
        label: 'Borrow Interest Rate',
        value: '8.00%',
        content:
            'The fee that accrues over time on outstanding debt. It is charged in mkUSD.',
    },
    {
        label: 'Redemption Rebate',
        value: '0.00%',
        content:
            'At time of redemption the redemption fee is paid back to the redeemed vault owner.',
    },
    {
        label: 'Staked Ether APR',
        value: '2.20%',
        content: '',
    },
];

const metadata = [
    {
        label: 'Total Value Locked',
        value: '$10.2m',
    },
    {
        label: 'Minted sfUSD',
        value: '3.20m/100.00m',
    },
    {
        label: 'MCR',
        value: '150%',
    },
];

export const CoinDetailsCard = ({ currency }: CoinDetailsCardProps) => {
    const CcyIcon = currencyMap[currency.NAME as CurrencySymbol].icon;

    return (
        <Card className='relative flex-1 rounded-xl border-0 shadow-md laptop:min-w-[260px]'>
            <CardHeader className='px-3 py-[21px]'>
                <CardTitle className='text-center text-8 font-semibold leading-10'>
                    <CcyIcon className='absolute left-3 top-3 h-14 w-14' />
                    {currency.NAME}
                </CardTitle>
            </CardHeader>
            <CardContent className='grid w-full gap-4 px-3 pb-4'>
                <ul className='flex flex-col'>
                    {metadata.map((meta, index) => (
                        <li
                            key={index}
                            className='flex justify-between border-b border-neutral-50 py-[5px] text-3 leading-4.5 last-of-type:border-b-0'
                        >
                            <span>{meta.label}</span>
                            <span className='font-semibold'>{meta.value}</span>
                        </li>
                    ))}
                </ul>
                <ul className='flex flex-col gap-1.5'>
                    {details.map((detail, index) => (
                        <li key={index}>
                            <DetailBox {...detail} />
                        </li>
                    ))}
                </ul>
                <div className='flex items-center justify-between rounded-xl bg-neutral-200 px-3 py-2.5 font-semibold text-neutral-800'>
                    <span className='text-3.5 leading-4.5'>APR</span>
                    <div className='flex gap-1'>
                        <TooltipProvider delayDuration={300}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className='font-numerical text-3.5 font-bold leading-4.5'>
                                        2.46 – 3.69%
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent
                                    className='max-w-[360px]'
                                    align='center'
                                    side='top'
                                    sideOffset={12}
                                >
                                    <p className='text-3 leading-4'>
                                        {`Active Debt: 3.06K`}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
            <CardFooter className='px-3'>
                <Link href={`/vaults/${currency.NAME}`} className='w-full'>
                    <Button className='w-full bg-neutral-800 text-3.5 text-neutral-50'>{`Choose ${currency.NAME}`}</Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

const DetailBox = ({
    label,
    value,
    content,
}: {
    label: string;
    value: string;
    content: string;
}) => {
    return (
        <div className='flex w-full justify-between rounded-xl bg-neutral-200 px-3 py-1 text-neutral-900'>
            {content ? (
                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className='cursor-pointer text-3 capitalize leading-4.5'>
                                {label}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent
                            className='max-w-[360px]'
                            align='center'
                            side='bottom'
                            sideOffset={12}
                        >
                            <p className='text-3 leading-4'>{content}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                <span className='text-3 capitalize leading-4.5'>{label}</span>
            )}
            <span className='text-3 font-bold leading-4.5'>{value}</span>
        </div>
    );
};
