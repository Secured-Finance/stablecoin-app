import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SFLogoDark from 'src/assets/img/logo-dark.svg';
import SFLogoLight from 'src/assets/img/logo-light.svg';
import { NavTab } from 'src/components/atoms';
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Switch,
} from 'src/components/ui';
import { AddressUtils } from 'src/utils';
import { useAccount, useDisconnect } from 'wagmi';
import { LINKS } from './constants';

const Header = () => {
    const { setTheme: setAppTheme, theme } = useTheme();
    const { open } = useWeb3Modal();
    const { disconnect } = useDisconnect();
    const { address } = useAccount();
    const isDarkTheme = theme === 'dark';

    const handleChecked = (checked: boolean) => {
        checked ? setAppTheme('dark') : setAppTheme('light');
    };

    return (
        <>
            <div className='relative'>
                <nav
                    data-cy='header'
                    className='h-16 w-full border-b-[1.5px] border-foreground bg-white dark:bg-black'
                >
                    <div className='flex h-full flex-row items-center justify-between px-5'>
                        <Link href='/' className='flex'>
                            {isDarkTheme ? (
                                <SFLogoDark className='inline h-4 w-40' />
                            ) : (
                                <SFLogoLight className='inline h-4 w-40' />
                            )}
                        </Link>
                        <div className='hidden h-full flex-row laptop:flex'>
                            {LINKS.map(link => (
                                <div key={link.text} className='h-full w-full'>
                                    <ItemLink
                                        text={link.text}
                                        link={link.link}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='flex items-center gap-2.5'>
                            {address ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant='default'
                                            size='sm'
                                            className='px-4'
                                        >
                                            {AddressUtils.format(address, 6)}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                        <DropdownMenuItem
                                            onSelect={() => disconnect()}
                                            className='cursor-pointer'
                                        >
                                            Disconnect Wallet
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onSelect={() =>
                                                window.open(
                                                    `https://etherscan.io/address/${address.toLowerCase()}`,
                                                    '_blank'
                                                )
                                            }
                                            className='cursor-pointer'
                                        >
                                            View on Etherscan
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button size='sm' onClick={() => open()}>
                                    Connect Wallet
                                </Button>
                            )}
                            <Switch
                                checked={isDarkTheme}
                                onCheckedChange={handleChecked}
                            />
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
};

const ItemLink = ({ text, link }: { text: string; link: string }) => {
    const router = useRouter();
    const useCheckActive = () => {
        return router.pathname.includes(link);
    };

    return (
        <Link href={link} className='h-full'>
            <NavTab text={text} active={useCheckActive()} />
        </Link>
    );
};

export default Header;
