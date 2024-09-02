import { useCallback } from 'react';
import { DepositWithdrawBox } from 'src/components/molecules';
import { Page } from 'src/components/templates';
import { useSPDeposit, useSPWithdraw } from 'src/hooks';
import { amountFormatterToBase, CurrencySymbol } from 'src/utils';

export const Earn = () => {
    const currency = CurrencySymbol.BTCb;
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
                <span className='text-16 text-black dark:text-white'>
                    Welcome to the Stable Coin Project!
                </span>
                <div className='flex flex-col gap-10'>
                    <DepositWithdrawBox
                        type='Deposit'
                        currency={currency}
                        onClick={handleSPDeposit}
                        balance={BigInt('141214214')}
                    />
                    <DepositWithdrawBox
                        type='Withdraw'
                        currency={currency}
                        onClick={handleSPWithdraw}
                        balance={BigInt('110000000')}
                    />
                </div>
            </div>
        </Page>
    );
};
