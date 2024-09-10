import { clsx } from 'clsx';

interface NavTabProps {
    text: string;
    active: boolean;
}

export const NavTab = ({ text, active = false }: NavTabProps) => {
    return (
        <div
            className='group relative flex h-full w-[100px] cursor-pointer flex-col'
            data-testid={`${text}-nav-tab`}
        >
            <div className='flex h-full items-center justify-center'>
                <span className='text-3.5 capitalize leading-4'>{text}</span>
            </div>
            <span
                className={clsx(
                    'absolute bottom-0 h-1 w-full group-hover:bg-foreground/50',
                    {
                        'bg-foreground': active,
                    }
                )}
            ></span>
        </div>
    );
};
