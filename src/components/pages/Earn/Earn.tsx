import { useCallback } from 'react';
import { DepositWithdrawBox } from 'src/components/molecules';
import { Page } from 'src/components/templates';
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
import { useSPDeposit, useSPWithdraw } from 'src/hooks';
import { amountFormatterToBase, CurrencySymbol } from 'src/utils';

export const Earn = () => {
    const currency = CurrencySymbol.FIL;
    const { onSPDeposit } = useSPDeposit();
    const { onSPWithdraw } = useSPWithdraw();

    const handleSPDeposit = useCallback(
        async (value: string) => {
            const depositAmount = amountFormatterToBase[currency](value);
            await onSPDeposit(depositAmount);
        },
        [currency, onSPDeposit]
    );

    const handleSPWithdraw = useCallback(
        async (value: string) => {
            const withdrawAmount = amountFormatterToBase[currency](value);
            await onSPWithdraw(withdrawAmount);
        },
        [currency, onSPWithdraw]
    );

    return (
        <Page name='earn'>
            <div className='flex h-full flex-col items-center justify-center gap-4'>
                <Card className='w-[560px] overflow-hidden'>
                    <CardHeader className='bg-primary text-background'>
                        <CardTitle>Manage BTC.b Stability Pool</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col'>
                        <div className='px-6 py-4'>
                            Deposit BTC.b to earn SF rewards. During
                            liquidations, your deposit will be used to purchase
                            discounted collaterals.
                        </div>
                        <Tabs defaultValue='deposit' className='w-full'>
                            <TabsList className='grid w-full grid-cols-2'>
                                <TabsTrigger value='deposit'>
                                    Deposit
                                </TabsTrigger>
                                <TabsTrigger value='withdraw'>
                                    Withdraw
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value='deposit' className='pt-4'>
                                <DepositWithdrawBox
                                    type='Deposit'
                                    currency={currency}
                                    onClick={handleSPDeposit}
                                    balance={BigInt('141214214')}
                                />
                            </TabsContent>
                            <TabsContent value='withdraw' className='pt-4'>
                                <DepositWithdrawBox
                                    type='Withdraw'
                                    currency={currency}
                                    onClick={handleSPWithdraw}
                                    balance={BigInt('110000000')}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </Page>
    );
};
