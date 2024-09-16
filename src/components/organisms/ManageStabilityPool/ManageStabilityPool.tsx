import Link from 'next/link';
import { useCallback, useState } from 'react';
import { DepositWithdrawBox } from 'src/components/molecules';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from 'src/components/ui';
import { amountFormatterToBase, CurrencySymbol } from 'src/utils';

export const ManageStabilityPool = ({
    currency,
}: {
    currency: CurrencySymbol;
}) => {
    // const { onSPDeposit } = useSPDeposit();
    // const { onSPWithdraw } = useSPWithdraw();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const handleSPDeposit = useCallback(
        async (value: string) => {
            setIsLoading(true);
            const depositAmount = amountFormatterToBase[currency](value);
            // await onSPDeposit(depositAmount);

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            await window.ethereum.request({
                method: 'personal_sign',
                params: [
                    'Mock approval for sfUSD deposit: ' + depositAmount,
                    accounts[0],
                ],
            });

            await new Promise(resolve => setTimeout(resolve, 2500));

            setIsLoading(false);
            setIsSuccess(true);
        },
        [currency]
    );

    const handleSPWithdraw = useCallback(
        async (value: string) => {
            setIsLoading(true);
            const withdrawAmount = amountFormatterToBase[currency](value);

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            await window.ethereum.request({
                method: 'personal_sign',
                params: [
                    'Mock approval for sfUSD withdrawal: ' + withdrawAmount,
                    accounts[0],
                ],
            });

            await new Promise(resolve => setTimeout(resolve, 2500));

            setIsLoading(false);
            setIsSuccess(true);
        },
        [currency]
    );

    return (
        <div className='flex h-full flex-col items-center justify-center gap-4'>
            <Card className='w-[584px] overflow-hidden rounded-xl'>
                <CardHeader className='bg-neutral-900 p-4 text-background'>
                    <CardTitle className='leading-5'>{`Manage ${currency} Stability Pool`}</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col px-8'>
                    {isSuccess ? (
                        <div className='flex flex-col items-center gap-3 py-3'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='44'
                                height='44'
                                viewBox='0 0 44 44'
                                fill='none'
                            >
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M22 38.5C31.1127 38.5 38.5 31.1127 38.5 22C38.5 12.8873 31.1127 5.50002 22 5.50002C12.8873 5.50002 5.5 12.8873 5.5 22C5.5 31.1127 12.8873 38.5 22 38.5ZM29.6459 19.3334C30.4514 18.528 30.4514 17.2221 29.6459 16.4166C28.8405 15.6112 27.5345 15.6112 26.7291 16.4166L19.9375 23.2082L17.2709 20.5416C16.4655 19.7362 15.1595 19.7362 14.3541 20.5416C13.5486 21.3471 13.5486 22.653 14.3541 23.4584L18.4791 27.5834C19.2845 28.3889 20.5905 28.3889 21.3959 27.5834L29.6459 19.3334Z'
                                    fill='#94A3B8'
                                />
                            </svg>
                            <div className='text-center'>
                                <h1 className='typography-desktop-body-3 font-semibold'>
                                    Deposit Successful
                                </h1>
                                <span className='typography-desktop-body-4'>
                                    Your deposit of 369.36 sfUSD is successful.{' '}
                                    <Link href='/' className='underline'>
                                        View transaction
                                    </Link>
                                    .
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className='py-3 text-center'>
                            {`Deposit ${currency} to earn SF rewards. During liquidations,
                        your deposit will be used to purchase discounted
                        collaterals.`}
                        </div>
                    )}
                    <Tabs defaultValue='deposit' className='w-full'>
                        <TabsList className='mt-2 grid w-full grid-cols-2'>
                            <TabsTrigger value='deposit'>Deposit</TabsTrigger>
                            <TabsTrigger value='withdraw'>Withdraw</TabsTrigger>
                        </TabsList>
                        <div className='mt-4'>
                            <TabsContent value='deposit'>
                                <DepositWithdrawBox
                                    type='Deposit'
                                    currency={currency}
                                    onClick={handleSPDeposit}
                                    balance={BigInt('141214214')}
                                    isLoading={isLoading}
                                    isSuccess={isSuccess}
                                />
                            </TabsContent>
                            <TabsContent value='withdraw'>
                                <DepositWithdrawBox
                                    type='Withdraw'
                                    currency={currency}
                                    onClick={handleSPWithdraw}
                                    balance={BigInt('110000000')}
                                    isLoading={isLoading}
                                    isSuccess={isSuccess}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};
