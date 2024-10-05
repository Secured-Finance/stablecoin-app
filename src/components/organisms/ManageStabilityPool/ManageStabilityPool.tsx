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
import { CurrencySymbol } from 'src/utils';

export const ManageStabilityPool = ({
    currency,
}: {
    currency: CurrencySymbol;
}) => {
    return (
        <div className='flex h-full flex-col items-center justify-center gap-4'>
            <Card className='w-[560px] overflow-hidden'>
                <CardHeader className='bg-primary text-background'>
                    <CardTitle>{`Manage ${currency} Stability Pool`}</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col'>
                    <div className='px-6 py-4'>
                        {`Deposit ${currency} to earn SF rewards. During liquidations,
                        your deposit will be used to purchase discounted
                        collaterals.`}
                    </div>
                    <Tabs defaultValue='deposit' className='w-full'>
                        <TabsList className='grid w-full grid-cols-2'>
                            <TabsTrigger value='deposit'>Deposit</TabsTrigger>
                            <TabsTrigger value='withdraw'>Withdraw</TabsTrigger>
                        </TabsList>
                        <TabsContent value='deposit' className='pt-4'>
                            <DepositWithdrawBox
                                type='Deposit'
                                currency={currency}
                                onClick={() => {}}
                                balance={BigInt('141214214')}
                            />
                        </TabsContent>
                        <TabsContent value='withdraw' className='pt-4'>
                            <DepositWithdrawBox
                                type='Withdraw'
                                currency={currency}
                                onClick={() => {}}
                                balance={BigInt('110000000')}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};
