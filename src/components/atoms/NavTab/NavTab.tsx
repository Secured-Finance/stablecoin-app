import clsx from 'clsx';

interface NavTabProps {
    text: string;
    active: boolean;
}

export const NavTab = ({ text, active = false }: NavTabProps) => {
    return (
        <div
            className='flex h-full w-fit cursor-pointer flex-col px-4'
            data-testid={`${text}-nav-tab`}
        >
            <div className='flex h-full items-center justify-center'>
                <span
                    className={clsx('text-3.5 capitalize leading-6', {
                        'font-semibold text-primary-500': active,
                        'font-normal text-neutral-800': !active,
                    })}
                >
                    {text}
                </span>
            </div>
        </div>
    );
};
