import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SFLogo from 'src/assets/img/logo.svg';
import { Tab } from 'src/components/atoms';
import { Button, Switch } from 'src/components/ui';
import { LINKS } from './constants';

const Header = () => {
    const { setTheme: setAppTheme, theme } = useTheme();

    const handleChecked = (checked: boolean) => {
        checked ? setAppTheme('dark') : setAppTheme('light');
    };

    return (
        <>
            <div className='relative'>
                <nav
                    data-cy='header'
                    className='h-16 w-full border-b border-black-20 dark:border-white-20'
                >
                    <div className='flex flex-row items-center justify-between'>
                        <Link href='/' className='flex pl-7'>
                            <SFLogo className='inline h-4 desktop:w-[160px]' />
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
                        <div className='flex items-center gap-2 pr-4'>
                            <Button size='sm'>Connect Wallet</Button>
                            <Switch
                                checked={theme === 'dark'}
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
        return router.pathname === link;
    };

    return (
        <Link href={link} className='h-full'>
            <Tab text={text} active={useCheckActive()} />
        </Link>
    );
};

export default Header;
