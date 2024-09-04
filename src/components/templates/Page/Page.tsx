import { Children } from 'react';

export const Page = ({
    children,
    name,
}: {
    children: React.ReactNode;
    name?: string;
}) => {
    return (
        <div
            className='relative mx-auto mt-3 flex flex-col gap-2 tablet:min-w-[728px] laptop:mt-6 laptop:min-w-[970px] laptop:gap-4 laptop:px-6 desktop:min-w-[1120px] desktop:max-w-[1920px]'
            data-testid={name}
        >
            <div className='flex flex-col gap-6'>
                {Children.map(children, (child, index) => {
                    if (child) {
                        return <div key={`page-${name}-${index}`}>{child}</div>;
                    }
                })}
            </div>
        </div>
    );
};
