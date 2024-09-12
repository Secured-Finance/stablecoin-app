import { Button, Card } from '@/components/ui';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useSPTroveDeposit } from '@/hooks/useSPTroveDeposit';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ProtocolConfigMap } from 'satoshi-sdk';
import { Page } from 'src/components/templates';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';

export const Minting = () => {
    const router = useRouter();

    const { isDisconnected } = useAccount();
    const { open } = useWeb3Modal();

    const protocolConfig = ProtocolConfigMap.BEVM_MAINNET;

    const [collAmt, setCollAmt] = useState<string>();

    // collateral will be retrieved from protocolConfig and router.query.collateral
    const addedCollAmt = parseEther('0.2'); // Let's add 0.2 BTC worth of WBTC
    const collateral =
        protocolConfig.COLLATERALS.find(
            coll => coll.ADDRESS === router.query.collateral
        ) || protocolConfig.COLLATERALS[0]; // WBTC Collateral

    const { onSPTroveDeposit: handleSPDeposit } = useSPTroveDeposit();

    const handleDepositFunds = async () => {
        if (isDisconnected) {
            open();
        } else {
            const receipt = await handleSPDeposit(collateral, addedCollAmt);

            if (receipt?.status === 200) {
                alert('Deposit Successful');
            }
        }
    };

    return (
        <Page name='collateral'>
            <Link href='/vaults' className='flex items-center gap-1 underline'>
                <ArrowLeftIcon />
                Go Back to Vaults
            </Link>
            <div className='mx-auto flex h-full max-w-[464px] flex-col items-center justify-center gap-4'>
                <h1 className='typography-desktop-h-6 text-center'>
                    Mint sfUSD by depositing FIL
                </h1>
                <Card className='flex w-full flex-col gap-3 px-6 py-3'>
                    <div className='flex items-center justify-between'>
                        <Label>Enter amount of FIL</Label>
                        <span>Balance: 0.005</span>
                    </div>
                    <Input
                        value={collAmt}
                        onChange={e => {
                            setCollAmt(e.target.value);
                        }}
                        onInput={e => {
                            const input = e.target as HTMLInputElement;
                            input.value = input.value.replace(/[^0-9.]/g, ''); // Allow only numbers and dots
                        }}
                    />
                    <div className='flex flex-col gap-1'>
                        <Label>Minting sfUSD</Label>
                        <Input
                            value={+(collAmt || '0') * 3.59}
                            disabled
                            className='text-neutral-900 disabled:opacity-100'
                        />
                    </div>
                    <Alert>
                        <AlertDescription>
                            A minimum loan of 1800 sfUSD is required
                        </AlertDescription>
                    </Alert>
                    <Button
                        className='w-full'
                        onClick={async () => await handleDepositFunds()}
                    >
                        {isDisconnected ? 'Connect Wallet' : 'Deposit funds'}
                    </Button>
                </Card>
            </div>
        </Page>
    );
};
