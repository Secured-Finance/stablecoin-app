import { CheckIcon, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import FIL from 'src/assets/coins/fil.svg';
import SFUsdIcon from 'src/assets/coins/sfusd.svg';
import { Page } from 'src/components/templates';
import {
    Button,
    buttonVariants,
    Card,
    CardContent,
    CardHeader,
} from 'src/components/ui';
import { Label } from 'src/components/ui/Label';
import { cn } from 'src/components/utils';

export const Success = () => {
    return (
        <Page name='success'>
            <div className='mx-auto flex h-full max-w-[434px] flex-col items-center justify-center gap-7'>
                <h1 className='typography-desktop-h-6 px-6 text-center'>
                    sfUSD mint successful
                </h1>
                <Card className='flex w-full flex-col gap-2 rounded-xl border-transparent bg-neutral-50 pb-2 shadow-md'>
                    <CardHeader className='py-3 shadow-sm'>
                        <h1 className='typography-desktop-body-3 text-center font-semibold'>
                            Minted sfUSD
                        </h1>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-2 border-b border-neutral-300 px-5 pb-5 pt-3'>
                        <div className='flex flex-col gap-1.5'>
                            <Label className='typography-desktop-body-4 font-normal text-neutral-900'>
                                FIL used as collateral
                            </Label>
                            <div className='flex items-center justify-between px-3 py-2.5'>
                                <span className='typography-desktop-body-2 font-semibold leading-6 text-neutral-500'>
                                    369
                                </span>
                                <span className='flex items-center gap-1 text-3.5 leading-6 text-neutral-600'>
                                    <FIL className='h-[18px] w-[18px]' /> FIL
                                </span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1.5 rounded-[8px] bg-neutral-800 p-1'>
                            <h2 className='typography-desktop-body-4 px-2 font-semibold text-neutral-50'>
                                sfUSD minted
                            </h2>
                            <div className='flex items-center justify-between rounded-[8px] border-[1.5px] border-neutral-600 bg-neutral-100 px-3 py-2'>
                                <span className='typography-desktop-body-2 font-semibold text-neutral-900'>
                                    2214.00
                                </span>
                                <div className='flex items-center gap-1 text-right text-3.5 leading-6 text-neutral-4'>
                                    <SFUsdIcon className='h-[18px] w-[18px]' />
                                    sfUSD
                                </div>
                            </div>
                        </div>
                        <div className='mt-3 flex flex-col rounded-[8px] bg-neutral-100 py-[9px]'>
                            <div className='px-2'>
                                <ul className='typography-desktop-body-4 flex flex-col gap-1.5 pb-1 text-neutral-900'>
                                    <li className='flex items-center justify-between'>
                                        <span>+Net loan</span>
                                        <span>2214.00 sfUSD</span>
                                    </li>
                                    <li className='flex items-center justify-between'>
                                        <span>+Mint Fee</span>
                                        <span>(1.00%) 22.14 sfUSD</span>
                                    </li>
                                    <li className='flex items-center justify-between'>
                                        <span className='flex items-center gap-1'>
                                            +Liquidation Reserve{' '}
                                            <InfoIcon className='h-3 w-3' />
                                        </span>
                                        <span>200 sfUSD</span>
                                    </li>
                                </ul>
                            </div>
                            <div className='border-t border-neutral-300 px-2 pb-[3px] pt-[7px]'>
                                <ul className='typography-desktop-body-4 flex flex-col gap-1.5 text-neutral-900'>
                                    <li className='flex items-center justify-between'>
                                        <span className='flex items-center gap-1'>
                                            Your total debt
                                            <InfoIcon className='h-3 w-3' />
                                        </span>
                                        <span>1991.86 sfUSD</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <Button className='flex-1 gap-1.5' disabled>
                                <CheckIcon className='h-[15px] w-[15px]' />
                                Approved
                            </Button>

                            <Button
                                className={cn(
                                    'flex-1',
                                    buttonVariants({ variant: 'outline' })
                                )}
                            >
                                <Link href='/vaults'>Manage Vault</Link>
                            </Button>
                        </div>
                    </CardContent>
                    <CardContent className='flex flex-col gap-2 px-5 pb-4 pt-3'>
                        <h2 className='typography-desktop-body-4'>
                            Information
                        </h2>
                        <ul className='typography-desktop-body-4 flex flex-col text-neutral-900'>
                            <li className='flex items-center justify-between'>
                                <span className='flex items-center gap-1'>
                                    Vault position
                                    <InfoIcon className='h-3 w-3' />
                                </span>
                                <span>1/1</span>
                            </li>
                            <li className='flex items-center justify-between'>
                                <span className='flex items-center gap-1'>
                                    Debt in front
                                    <InfoIcon className='h-3 w-3' />
                                </span>
                                <span>2214.00 sfUSD</span>
                            </li>
                            <li className='flex items-center justify-between'>
                                <span className='flex items-center gap-1'>
                                    Collateral Ratio
                                    <InfoIcon className='h-3 w-3' />
                                </span>
                                <span>100.00%</span>
                            </li>
                            <li className='flex items-center justify-between'>
                                <span className='flex items-center gap-1'>
                                    Liquidation Price
                                    <InfoIcon className='h-3 w-3' />
                                </span>
                                <span>$5.00</span>
                            </li>
                            <li className='flex items-center justify-between'>
                                <span className='flex items-center gap-1'>
                                    Borrow Interest Rate
                                    <InfoIcon className='h-3 w-3' />
                                </span>
                                <span>10.00%</span>
                            </li>
                            <li className='flex items-center justify-between'>
                                <span className='flex items-center gap-1'>
                                    Remaining mintable sfUSD
                                    <InfoIcon className='h-3 w-3' />
                                </span>
                                <span>96,804,747.31</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </Page>
    );
};
