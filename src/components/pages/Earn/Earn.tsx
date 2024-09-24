import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { Page } from 'src/components/templates';
import { Button, DataTable } from 'src/components/ui';
import {
    currencyMap,
    CurrencySymbol,
    ordinaryFormat,
    percentFormat,
    usdFormat,
} from 'src/utils';

export type Payment = {
    id: string;
    currency: CurrencySymbol;
    tvl: number;
    unboostedApr: number;
    boostedApr: number;
    deposit: number;
    earned: number;
};

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: 'currency',
        header: '',
        cell: ({ row }) => {
            const currency = row.original.currency;
            const Icon = currencyMap[currency].icon;

            return (
                <div className='flex items-center gap-1.5 p-4'>
                    <Icon
                        className='h-8 w-8'
                        role='img'
                        aria-label={currency}
                    />
                    <span className='text-4 leading-5 text-neutral-900'>
                        {currency}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'tvl',
        header: 'TVL',
        cell: ({ row }) => {
            return (
                <div className='flex items-center px-4'>
                    <span className='text-4 leading-5 text-neutral-900'>
                        {usdFormat(row.original.tvl, 2, 'compact')}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'unboostedApr',
        header: 'Unboosted APR',
        cell: ({ row }) => {
            return (
                <div className='flex items-center px-4'>
                    <span className='text-4 leading-5 text-neutral-900'>
                        {percentFormat(row.original.unboostedApr, 100, 2, 2)}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'boostedApr',
        header: 'Boosted APR',
        cell: ({ row }) => {
            return (
                <div className='flex items-center px-4'>
                    <span className='text-4 leading-5 text-neutral-900'>
                        {percentFormat(row.original.boostedApr, 100, 2, 2)}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'deposit',
        header: 'Your Deposits',
        cell: ({ row }) => {
            const currency = row.original.currency;
            const Icon = currencyMap[currency].icon;

            return (
                <div className='flex items-center gap-1 px-4'>
                    <Icon
                        className='h-[22px] w-[22px]'
                        role='img'
                        aria-label={currency}
                    />
                    <span className='text-4 leading-5 text-neutral-900'>
                        {ordinaryFormat(row.original.deposit, 2, 2)}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'earned',
        header: 'Earned',
        cell: ({ row }) => {
            const currency = row.original.currency;
            const Icon = currencyMap[currency].icon;

            return (
                <div className='flex items-center gap-1 px-4'>
                    <Icon
                        className='h-[22px] w-[22px]'
                        role='img'
                        aria-label={currency}
                    />
                    <span className='text-4 leading-5 text-neutral-900'>
                        {ordinaryFormat(row.original.earned, 2, 2)}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: '',
        cell: function CellComponent({ row }) {
            const router = useRouter();
            const currency = row.original.currency;

            return (
                <div className='flex w-fit items-center px-4'>
                    <Button
                        className='px-10 py-2'
                        onClick={() => router.push(`/earn/${currency}`)}
                    >
                        Manage
                    </Button>
                </div>
            );
        },
    },
];

const data: Payment[] = [
    {
        id: '728ed52f',
        currency: CurrencySymbol.sfUSD,
        tvl: 443430,
        unboostedApr: 4.07,
        boostedApr: 8.13,
        deposit: 0.0,
        earned: 0.0,
    },
];

export const Earn = () => {
    return (
        <Page name='earn'>
            <div className='px-36'>
                <div className='flex h-full flex-1 flex-col rounded-xl bg-background pb-4'>
                    <div className='flex items-center justify-between px-6 pb-2 pt-6'>
                        <h2 className='text-4.5 font-semibold leading-[26px] text-neutral-900'>
                            Stability Pool
                        </h2>
                    </div>
                    <DataTable data={data} columns={columns} />
                </div>
            </div>
        </Page>
    );
};
