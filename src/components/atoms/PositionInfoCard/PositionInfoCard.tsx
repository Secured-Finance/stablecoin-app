import { Link } from 'react-router-dom';

type InfoCardProps = {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    buttonText: string;
    to: string;
};

export const PositionInfoCard = ({
    icon: Icon,
    title,
    description,
    buttonText,
    to,
}: InfoCardProps) => {
    return (
        <div className='max-w-[450px] rounded-xl border border-neutral-9 bg-white p-6'>
            <div className='mb-6 flex'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-50'>
                    <Icon className='h-6 w-6 text-[#A6A6A6]' />
                </div>
            </div>
            <h3 className='text-lg mb-2 font-bold'>{title}</h3>
            <p className='mb-6 text-sm text-secondary-400'>{description}</p>

            <Link
                to={to}
                data-testid='button-link'
                className='mt-4 w-full rounded-md bg-primary-500 py-2 text-white'
            >
                {buttonText}
            </Link>
        </div>
    );
};
