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
            className='desktop:max-w-[1920px relative mx-auto mt-3 flex flex-col gap-2 tablet:min-w-[728px] laptop:mt-12 laptop:min-w-[970px] laptop:gap-4 laptop:px-6 desktop:min-w-[1120px]'
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
