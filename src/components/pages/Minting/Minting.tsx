import { useWeb3Modal } from '@web3modal/wagmi/react';
import { ArrowLeftIcon, CheckIcon, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import FIL from 'src/assets/coins/FIL.svg';
import { Page } from 'src/components/templates';
import {
    Button,
    buttonVariants,
    Card,
    CardContent,
    CardHeader,
} from 'src/components/ui';
import { Input } from 'src/components/ui/Input';
import { Label } from 'src/components/ui/Label';
import { cn } from 'src/components/utils';
import { useSPTroveDeposit } from 'src/hooks/useSPTroveDeposit';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';

export const Minting = () => {
    const router = useRouter();

    const { isDisconnected } = useAccount();
    const { open } = useWeb3Modal();

    const [collAmt, setCollAmt] = useState<string>();
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [defaultPercentage, setDefaultPercentage] = useState<number>(150);

    const addedCollAmt = parseEther('0.2'); // Let's add 0.2 BTC worth of WBTC
    const collateral = router.query.collateral;

    const { onSPTroveDeposit: handleSPDeposit } = useSPTroveDeposit();

    const handleDepositFunds = async () => {
        await handleSPDeposit(collateral as string, addedCollAmt);

        new Promise(resolve => setTimeout(resolve, 2000));

        router.push('/success');
    };

    // This is a mock function to simulate signing data
    const mockHandleApprove = async () => {
        // Simulate signing data
        setIsLoading(true);

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });

        await window.ethereum.request({
            method: 'personal_sign',
            params: ['Mock approval for sfUSD minting', accounts[0]],
        });

        setIsLoading(false);
        setIsApproved(true);
    };

    return (
        <Page name='collateral'>
            <Link
                href='/vaults'
                className='typography-desktop-body-4 flex items-center gap-1.5 text-neutral-500'
            >
                <ArrowLeftIcon className='h-4 w-4' />
                Go back to Collateral Selection
            </Link>
            <div className='mx-auto flex h-full max-w-[434px] flex-col items-center justify-center gap-7'>
                <h1 className='typography-desktop-h-6 px-6 text-center'>
                    Determine how much sfUSD you want
                </h1>
                <Card className='flex w-full flex-col gap-2 rounded-xl border-transparent bg-neutral-50 pb-2 shadow-md'>
                    <CardHeader className='py-3 shadow-sm'>
                        <h1 className='typography-desktop-body-3 text-center font-semibold'>
                            Mint sfUSD
                        </h1>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-3 px-5 py-3'>
                        <div className='flex flex-col gap-1.5'>
                            <div className='typography-desktop-body-4 flex items-center justify-between'>
                                <Label className='font-normal'>
                                    Enter amount of {collateral}
                                </Label>
                                <span className='flex items-center gap-1 text-neutral-600'>
                                    Balance: <FIL /> 0.005
                                </span>
                            </div>
                            <div className='relative'>
                                <Input
                                    value={collAmt}
                                    onChange={e => {
                                        setCollAmt(e.target.value);
                                    }}
                                    placeholder='Enter an amount'
                                    onInput={e => {
                                        const input =
                                            e.target as HTMLInputElement;
                                        input.value = input.value.replace(
                                            /[^0-9.]/g,
                                            ''
                                        ); // Allow only numbers and dots
                                    }}
                                />
                                <span className='absolute right-3 top-1/2 flex -translate-y-1/2 select-none items-center gap-2.5 text-3.5 text-neutral-600'>
                                    <Button
                                        size='badge'
                                        onClick={() => setCollAmt('0.005')}
                                    >
                                        MAX
                                    </Button>
                                    {collateral}
                                </span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <Label className='typography-desktop-body-4 font-normal'>
                                Calculate Loan
                            </Label>
                            <div className='flex items-center gap-2'>
                                <Input
                                    className='flex-1'
                                    value={defaultPercentage}
                                    onChange={e => {
                                        const input =
                                            e.target as HTMLInputElement;
                                        const value = input.value.replace(
                                            /[^0-9.]/g,
                                            ''
                                        ); // Allow only numbers and dots
                                        setDefaultPercentage(Number(value));
                                    }}
                                />
                                <span className='pl-[17px] pr-1 font-medium'>
                                    %
                                </span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <Label className='typography-desktop-body-4 font-normal'>
                                sfUSD to mint
                            </Label>
                            <div className='relative'>
                                <Input
                                    value={(+(collAmt || '0') * 3.59).toFixed(
                                        4
                                    )}
                                    disabled
                                    className='text-neutral-900 disabled:opacity-100'
                                />
                                <span className='absolute right-3 top-1/2 -translate-y-1/2 select-none text-3.5 text-neutral-600'>
                                    sfUSD
                                </span>
                            </div>
                        </div>
                        {isDisconnected ? (
                            <Button className='w-full' onClick={() => open()}>
                                Connect Wallet
                            </Button>
                        ) : (
                            <div className='flex gap-2'>
                                <Button
                                    className='flex-1 gap-1.5'
                                    onClick={() => mockHandleApprove()}
                                    disabled={isApproved || isLoading}
                                >
                                    {isLoading && (
                                        <LoaderCircle className='h-[15px] w-[15px] animate-spin' />
                                    )}
                                    {isLoading ? (
                                        'Approving...'
                                    ) : isApproved ? (
                                        <>
                                            <CheckIcon className='h-[15px] w-[15px]' />{' '}
                                            Approved
                                        </>
                                    ) : (
                                        'Approve'
                                    )}
                                </Button>
                                <Button
                                    className={cn(
                                        'flex-1',
                                        buttonVariants({ variant: 'outline' })
                                    )}
                                    onClick={async () =>
                                        await handleDepositFunds()
                                    }
                                    disabled={!isApproved}
                                >
                                    Open Vault
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            {/* <Statistics /> */}
        </Page>
    );
};
