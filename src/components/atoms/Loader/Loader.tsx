import { LoaderCircle } from 'lucide-react';

export const Loader = () => {
    return (
        <div className='flex h-screen items-center justify-center'>
            <div className='flex items-center gap-2'>
                <LoaderCircle className='h-6 w-6 animate-spin' />
                <span className='text-4 leading-4'>Loading...</span>
            </div>
        </div>
    );
};
