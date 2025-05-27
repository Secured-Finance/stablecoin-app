import Link from 'next/link';
import DiscordIcon from 'src/assets/icons/discord.svg';
import GitHubIcon from 'src/assets/icons/github.svg';
import MediumIcon from 'src/assets/icons/medium.svg';
import SecuredFinanceLogo from 'src/assets/icons/sflogo.svg';
import TwitterIcon from 'src/assets/icons/twitter.svg';

export const Footer = () => {
    return (
        <footer className='border-t-[0.5px] border-neutral-9 px-6 py-7'>
            <div className='flex items-center justify-between gap-4 tablet:flex-col laptop:flex-row'>
                <div className='flex items-center gap-2'>
                    <span className='text-sm text-secondary-400'>Built by</span>
                    <SecuredFinanceLogo className='h-[16px] w-[160px]' />
                </div>

                <div className='flex items-center gap-6'>
                    <Link href='#' aria-label='GitHub'>
                        <GitHubIcon className='h-5 w-5' />
                    </Link>
                    <Link href='#' aria-label='Discord'>
                        <DiscordIcon className='h-5 w-5' />
                    </Link>
                    <Link href='#' aria-label='Twitter'>
                        <TwitterIcon className='h-5 w-5' />
                    </Link>
                    <Link href='#' aria-label='Medium'>
                        <MediumIcon className='h-5 w-5' />
                    </Link>
                </div>
            </div>
        </footer>
    );
};
