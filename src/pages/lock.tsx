import { Page } from 'src/components/templates';

function Lock() {
    return (
        <Page name='lock'>
            <div className='flex h-full flex-col items-center justify-center gap-2'>
                <span className='text-16 text-black dark:text-white'>
                    Welcome to the Stable Coin Project!
                </span>
            </div>
        </Page>
    );
}

export default Lock;
