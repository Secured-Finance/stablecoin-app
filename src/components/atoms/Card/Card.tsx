import { cn } from 'src/utils';

type CardProps = {
    className?: string;
    children: React.ReactNode;
};

export const Card = ({ className, children }: CardProps) => {
    return (
        <div
            className={cn(
                'w-full max-w-[450px] rounded-xl border border-neutral-9 bg-white p-6',
                className
            )}
        >
            {children}
        </div>
    );
};
