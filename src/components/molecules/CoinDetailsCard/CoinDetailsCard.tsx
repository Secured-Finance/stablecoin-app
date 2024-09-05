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
import { CurrencySymbol } from 'src/utils';

interface CoinDetailsCardProps {
    currency: CurrencySymbol;
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

export const CoinDetailsCard = ({ currency }: CoinDetailsCardProps) => {
    return (
        <Card className='w-[260px]'>
            <CardHeader>
                <CardTitle className='text-center text-6 font-semibold leading-6'>
                    {currency}
                </CardTitle>
            </CardHeader>
            <CardContent className='grid w-full gap-4 px-0'>
                <div className='flex flex-col gap-[6px] px-3'>
                    {details.map((detail, index) => (
                        <div key={index}>
                            <DetailBox {...detail} />
                        </div>
                    ))}
                </div>
                <div className='flex items-center justify-between rounded-[18px] bg-foreground py-2.5 pl-2.5 pr-1.5 text-background'>
                    <span className='text-4 font-bold leading-4.5'>APR</span>
                    <div className='flex gap-1'>
                        <span className='font-numerical text-3.5 font-bold leading-5'>
                            1.81% {'->'} 3.63%
                        </span>
                        <TooltipProvider delayDuration={300}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className='flex h-[22px] w-[22px] cursor-pointer rounded-full bg-background'></span>
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
                <Button className='w-full'>{`Choose ${currency}`}</Button>
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
        <div className='flex w-full justify-between rounded-xl bg-foreground px-3 py-[3px] text-background'>
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
