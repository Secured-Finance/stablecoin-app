import { Card } from 'src/components/atoms';

export type PositionInfoCardProps = {
    icon?: React.ComponentType<{ className?: string }>;
    title?: string;
    children?: React.ReactNode;
};

export const PositionInfoCard = ({
    icon: Icon,
    title,
    children,
}: PositionInfoCardProps) => {
    return (
        <Card className='flex flex-col justify-between gap-1 p-6'>
            {(Icon || title) && (
                <div className='mb-6 flex items-center gap-3'>
                    {Icon && (
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-50'>
                            <Icon className='h-6 w-6 text-primary-500' />
                        </div>
                    )}
                    {title && (
                        <h3 className='text-xl font-semibold text-neutral-900'>
                            {title}
                        </h3>
                    )}
                </div>
            )}
            {children}
        </Card>
    );
};
