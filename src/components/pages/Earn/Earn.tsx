import { useCallback, useState } from 'react';
import { DepositWithdrawBox } from 'src/components/molecules';
import { Page } from 'src/components/templates';
import { useSPDeposit, useSPWithdraw } from 'src/hooks';
import { amountFormatterToBase, CurrencySymbol, ZERO_BI } from 'src/utils';

export const Earn = () => {
    const [depositAmount, setDepositAmount] = useState<bigint>(ZERO_BI);
    const [withdrawAmount, setWithdrawAmount] = useState<bigint>(ZERO_BI);

    const currency = CurrencySymbol.BTCb;
    const { onSPDeposit } = useSPDeposit(depositAmount);
    const { onSPWithdraw } = useSPWithdraw(withdrawAmount);

    const handleSPDeposit = useCallback(
        async (value: string) => {
            setDepositAmount(amountFormatterToBase[currency](value));
            await onSPDeposit();
        },
        [currency, onSPDeposit]
    );

    const handleSPWithdraw = useCallback(
        async (value: string) => {
            setWithdrawAmount(amountFormatterToBase[currency](value));
            await onSPWithdraw();
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
