import { clsx } from 'clsx';

interface NavTabProps {
    text: string;
    active: boolean;
}

export const NavTab = ({ text, active = false }: NavTabProps) => {
    return (
        <div
            className='h-full w-fit cursor-pointer flex-col px-4'
            data-testid={`${text}-nav-tab`}
        >
            <span
                className={clsx('text-3.5 capitalize leading-6', {
                    'font-semibold text-primary-500': active,
                    'font-normal text-neutral-800': !active,
                })}
            >
                {text}
            </span>
        </div>
    );
};
