import { Layers2, Vault } from 'lucide-react';
import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
import { PositionInfoCard } from '../PositionInfoCard';
import { CURRENCY } from 'src/strings';

export const EmptyPositions = () => {
    const emptyStates = [
        {
            icon: <Vault className='h-6 w-6 text-neutral-450' />,
            title: 'No Trove Yet',
            description: `A Trove is your personal vault where you can deposit ${CURRENCY}
as collateral to borrow USDFC with 0% interest, while
maintaining exposure to ${CURRENCY}.`,
            href: '/trove',
            buttonText: 'Create Trove',
        },
        {
            icon: <Layers2 className='h-6 w-6 text-neutral-450' />,
            title: 'No Stability Pool Deposit Yet',
            description: `Deposit USDFC to earn ${CURRENCY} rewards. The pool helps
maintain system stability by covering liquidated debt,
ensuring a balanced and secure ecosystem.`,
            href: '/stability-pool',
            buttonText: 'Deposit',
        },
    ];
    return (
        <div className='w-full'>
            <h2 className='text-2xl mb-4 text-center font-semibold leading-none'>
                My Positions
            </h2>

            <div className='grid w-full grid-cols-1 justify-items-center gap-6 laptop:grid-cols-2'>
                {emptyStates.map(
                    ({ icon, title, description, href, buttonText }, index) => (
                        <PositionInfoCard
                            key={index}
                            icon={() => icon}
                            title={title}
                            verticalHeader={true}
                        >
                            <p className='mb-3 min-h-[48px] font-primary text-4 text-secondary-400'>
                                {description}
                            </p>
                            <Button
                                href={href}
                                external={false}
                                data-testid='button-link'
                                variant={ButtonVariants.primary}
                                size={ButtonSizes.md}
                                className='mt-6 w-full'
                            >
                                {buttonText}
                            </Button>
                        </PositionInfoCard>
                    )
                )}
            </div>
        </div>
    );
};
