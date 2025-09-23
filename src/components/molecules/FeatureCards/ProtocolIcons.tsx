import BlueIcon from 'src/assets/icons/blue.svg';
import GreyIcon from 'src/assets/icons/grey.svg';
import YellowIcon from 'src/assets/icons/yellow.svg';

export function BorrowIcon() {
    return (
        <div className='mb-6 flex h-16 w-60 items-start justify-start'>
            <BlueIcon className='h-16 w-32' />
        </div>
    );
}

export function EarnIcon() {
    return (
        <div className='mb-6 flex h-16 w-60 items-start justify-start'>
            <YellowIcon className='h-16 w-32' />
        </div>
    );
}

export function BridgeIcon() {
    return (
        <div className='mb-6 flex h-16 w-60 items-start justify-start'>
            <GreyIcon className='h-16 w-32 drop-shadow-md' />
        </div>
    );
}
