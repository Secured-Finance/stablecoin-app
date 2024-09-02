import { clsx } from 'clsx';

interface NavTabProps {
    text: string;
    active: boolean;
}

export const NavTab = ({ text, active = false }: NavTabProps) => {
    return (
        <div
            className='group flex h-16 w-fit flex-col'
            data-testid={`${text}-nav-tab`}
        >
            <div className='flex flex-grow items-center justify-center px-10 text-3.5 uppercase leading-4'>
                {text}
            </div>
            <span
                className={clsx(
                    'h-1 w-full group-hover:bg-black-20 dark:group-hover:bg-white-20',
                    {
                        'bg-black dark:bg-white': active,
                    }
                )}
            ></span>
        </div>
    );
};
