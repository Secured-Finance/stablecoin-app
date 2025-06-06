import { Link } from 'react-router-dom';
import { Card } from 'src/components/atoms';

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
        <Card>
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
                className='mt-4 block w-full rounded-md bg-primary-500 p-2 text-center text-white'
            >
                {buttonText}
            </Link>
        </Card>
    );
};
