import BlueIcon from 'src/assets/icons/blue.svg';
import YellowIcon from 'src/assets/icons/yellow.svg';
import GreyIcon from 'src/assets/icons/grey.svg';

export function BorrowIcon() {
    return (
        <div className='mb-6 flex h-[60px] w-[242px] items-start justify-start'>
            <BlueIcon className='h-[60px] w-[120px]' />
        </div>
    );
}

export function EarnIcon() {
    return (
        <div className='mb-6 flex h-[60px] w-[242px] items-start justify-start'>
            <YellowIcon className='h-[60px] w-[120px]' />
        </div>
    );
}

export function BridgeIcon() {
    return (
        <div className='mb-6 flex h-[60px] w-[242px] items-start justify-start'>
            <GreyIcon className='h-[60px] w-[120px] drop-shadow-md' />
        </div>
    );
}
