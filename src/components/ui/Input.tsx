import * as React from 'react';

import { cn } from 'src/components/utils';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'text-sm file:text-sm flex h-10 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 font-semibold ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:font-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

export { Input };
