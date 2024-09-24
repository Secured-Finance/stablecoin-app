import { Decimal, LiquityStoreState } from '@liquity/lib-base';
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
import { useLiquity, useLiquitySelector } from 'src/hooks';
import { useTransactionFunction } from 'src/hooks/useTransactionFunction';
import { CurrencySymbol } from 'src/utils';

const selector = ({
    remainingStabilityPoolLQTYReward,
    accountBalance,
    lusdBalance,
    lqtyBalance,
    lusdInStabilityPool,
    stabilityDeposit,
}: LiquityStoreState) => ({
    remainingStabilityPoolLQTYReward,
    accountBalance,
    lusdBalance,
    lqtyBalance,
    lusdInStabilityPool,
    stabilityDeposit,
});

export const ManageStabilityPool = ({
    currency,
}: {
    currency: CurrencySymbol;
}) => {
    const { lusdBalance: realLusdBalance, stabilityDeposit } =
        useLiquitySelector(selector);

    const [amount, setAmount] = useState('0');
    const { liquity } = useLiquity();

    const transactionId = 'stability-deposit';

    const [sendTransaction] = useTransactionFunction(
        transactionId,
        liquity.send.withdrawLUSDFromStabilityPool.bind(
            liquity.send,
            Decimal.from(amount)
        )
    );

    const handleSPDeposit = useCallback(
        async (value: string) => {
            setAmount(value);
            await sendTransaction();
        },
        [sendTransaction]
    );

    const handleSPWithdraw = useCallback(
        async (value: string) => {
            setAmount(value);
            await sendTransaction();
        },
        [sendTransaction]
    );

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
                                onClick={handleSPDeposit}
                                balance={realLusdBalance}
                            />
                        </TabsContent>
                        <TabsContent value='withdraw' className='pt-4'>
                            <DepositWithdrawBox
                                type='Withdraw'
                                currency={currency}
                                onClick={handleSPWithdraw}
                                balance={stabilityDeposit.currentLUSD}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};
