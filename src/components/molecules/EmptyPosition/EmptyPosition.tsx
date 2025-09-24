import { LucideIcon } from 'lucide-react';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
import { PositionInfoCard } from '../PositionInfoCard';

interface EmptyPositionProps {
    icon: LucideIcon;
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
}

export const EmptyPosition = ({
    icon,
    title,
    description,
    buttonText,
    buttonHref,
}: EmptyPositionProps) => {
    return (
        <PositionInfoCard icon={icon} isEmpty={true}>
            <h3 className='text-lg mb-2 font-semibold text-neutral-900'>
                No {title}
            </h3>

            <p className='mb-6 text-sm leading-relaxed text-neutral-600'>
                {description}
            </p>

            <Button
                href={buttonHref}
                size={ButtonSizes.md}
                variant={ButtonVariants.primary}
                className='w-full rounded-xl'
                external={false}
            >
                {buttonText}
            </Button>
        </PositionInfoCard>
    );
};
