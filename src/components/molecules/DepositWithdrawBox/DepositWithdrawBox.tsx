import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useMemo, useState } from 'react';
import { InputBase } from 'src/components/atoms';
import { Button } from 'src/components/ui';
import {
    amountFormatterToBase,
    currencyMap,
    CurrencySymbol,
    ordinaryFormat,
    ZERO_BI,
} from 'src/utils';
import { useAccount } from 'wagmi';

interface DepositWithdrawBoxProps {
    type: 'Deposit' | 'Withdraw';
    balance: bigint;
    currency: CurrencySymbol;
    onClick: (value: string) => void;
}

export const DepositWithdrawBox = ({
    type,
    balance,
    currency,
    onClick,
}: DepositWithdrawBoxProps) => {
    const ccy = currencyMap[currency];
    const { open } = useWeb3Modal();

    const { address } = useAccount();
    const [amount, setAmount] = useState<string>();

    const isButtonDisabled = useMemo(
        () =>
            !amount ||
            amountFormatterToBase[currency](amount) === ZERO_BI ||
            amountFormatterToBase[currency](amount) > balance,
        [amount, balance, currency]
    );

    return (
        <div className='flex w-[560px] flex-col gap-2'>
            <div className='flex flex-col gap-1'>
                <div className='flex items-center justify-between'>
                    <span>{`${type} ${currency}`}</span>
                    <div className=''>
                        <span>Balance: </span>
                        <span>
                            {ordinaryFormat(
                                ccy.fromBaseUnit(balance),
                                0,
                                ccy.roundingDecimal
                            )}
                        </span>
                    </div>
                </div>
                <div className='flex h-10 w-full items-center justify-between overflow-hidden rounded-lg border'>
                    <div className='flex w-full justify-between gap-2 px-2'>
                        <InputBase
                            value={amount}
                            onValueChange={setAmount}
                            placeHolder='Enter an amount'
                        />
                        <Button size='badge'>MAX</Button>
                    </div>
                    <div className='flex h-full w-fit items-center bg-black px-3 text-white dark:bg-white dark:text-black'>
                        {currency}
                    </div>
                </div>
            </div>
            {address ? (
                <Button
                    size='default'
                    onClick={() => onClick(amount ?? '')}
                    disabled={isButtonDisabled}
                >
                    {type}
                </Button>
            ) : (
                <Button size='default' onClick={() => open()}>
                    Connect Wallet
                </Button>
            )}
        </div>
    );
};
