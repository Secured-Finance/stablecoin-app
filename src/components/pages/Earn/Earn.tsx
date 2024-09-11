import { ColumnDef } from '@tanstack/react-table';
import { Page } from 'src/components/templates';
import { DataTable } from 'src/components/ui';

export type Payment = {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'success' | 'failed';
    email: string;
};

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
    },
];

const data: Payment[] = [
    {
        id: '728ed52f',
        amount: 100,
        status: 'pending',
        email: 'm@example.com',
    },
];

export const Earn = () => {
    return (
        <Page name='earn'>
            <DataTable columns={columns} data={data} />
        </Page>
    );
};
