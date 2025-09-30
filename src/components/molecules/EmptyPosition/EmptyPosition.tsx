import { LucideIcon } from 'lucide-react';
import { Button } from 'src/components/atoms';

interface EmptyPositionProps {
    icon: LucideIcon;
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
}

export const EmptyPosition = ({
    icon: Icon,
    title,
    description,
    buttonText,
    buttonHref,
}: EmptyPositionProps) => {
    return (
        <div className='flex h-full w-full max-w-[448px] flex-col justify-between rounded-[20px] border border-neutral-150 bg-white p-6 tablet:p-10'>
            <div className='mx-auto h-[228px] w-full max-w-[368px] flex-col items-center gap-6'>
                <div className='flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border border-neutral-150 bg-[#FAFAFA]'>
                    <Icon size={24} className='text-[#A6A6A6]' />
                </div>

                <div className='mt-6 flex flex-1 flex-col justify-center gap-2 text-left'>
                    <h3 className='font-primary text-5 font-semibold leading-[24px] text-neutral-900'>
                        {`No ${title}`}
                    </h3>
                    <p className='font-primary text-4 font-normal leading-[23px] text-neutral-450'>
                        {description}
                    </p>
                </div>
            </div>

            <div className='mx-auto flex w-full max-w-[368px]'>
                <Button
                    className='mt-10 flex h-[43px] w-full items-center justify-center rounded-[12px] bg-primary-500 text-4 font-semibold leading-[19px] text-white'
                    href={buttonHref}
                    external={false}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};
