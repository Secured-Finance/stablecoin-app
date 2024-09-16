import { useWeb3Modal } from '@web3modal/wagmi/react';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import SFUsdIcon from 'src/assets/coins/sfusd.svg';
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
    isLoading: boolean;
    isSuccess: boolean;
}

export const DepositWithdrawBox = ({
    type,
    balance,
    currency,
    onClick,
    isLoading,
    isSuccess,
}: DepositWithdrawBoxProps) => {
    const ccy = currencyMap[currency];
    const { open } = useWeb3Modal();

    const { address } = useAccount();
    const [amount, setAmount] = useState<string>();

    const isButtonDisabled = useMemo(
        () => !amount || amountFormatterToBase[currency](amount) === ZERO_BI,
        [amount, currency]
    );

    const verb = type === 'Deposit' ? type : 'Withdrawal';

    useEffect(() => {
        if (isSuccess) {
            setAmount(undefined);
        }
    }, [isSuccess]);

    return (
        <div className='flex w-full flex-col gap-3'>
            <div className='flex flex-col gap-1'>
                <div className='typography-desktop-body-4 flex items-center justify-between'>
                    <span>{`${type} ${currency}`}</span>
                    <div className='flex items-center gap-1'>
                        <span>Balance: </span>
                        <SFUsdIcon />
                        <span>
                            {ordinaryFormat(
                                ccy.fromBaseUnit(balance),
                                0,
                                ccy.roundingDecimal
                            )}
                        </span>
                    </div>
                </div>
                <div className='flex h-10 w-full items-center justify-between overflow-hidden rounded-lg border border-foreground'>
                    <div className='flex w-full items-center justify-between gap-2 pl-3'>
                        <InputBase
                            value={amount}
                            onValueChange={setAmount}
                            placeHolder='Enter an amount'
                            className='typography-desktop-body-3 py-2 font-semibold placeholder:font-normal'
                        />
                        <Button size='badge'>MAX</Button>
                    </div>
                    <div className='flex h-full w-fit items-center pl-2.5 pr-3 text-3.5 font-semibold'>
                        {currency}
                    </div>
                </div>
            </div>
            {address ? (
                <Button
                    size='default'
                    className='flex items-center gap-1.5 disabled:bg-neutral-400'
                    onClick={() => onClick(amount ?? '')}
                    disabled={isButtonDisabled || isLoading}
                >
                    {isLoading ? (
                        <>
                            <LoaderCircle className='h-[15px] w-[15px] animate-spin' />
                            {verb} in process...
                        </>
                    ) : isSuccess ? (
                        `${type} again`
                    ) : (
                        type
                    )}
                </Button>
            ) : (
                <Button size='default' onClick={() => open()}>
                    Connect Wallet
                </Button>
            )}
        </div>
    );
};
