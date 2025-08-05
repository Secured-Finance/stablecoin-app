import BlueIcon from 'src/assets/icons/blue.svg';
import GreyIcon from 'src/assets/icons/grey.svg';
import YellowIcon from 'src/assets/icons/yellow.svg';

export function BorrowIcon() {
    return (
        <div className='h-15 mb-6 flex w-60 items-start justify-start'>
            <BlueIcon className='h-15 w-30' />
        </div>
    );
}

export function EarnIcon() {
    return (
        <div className='h-15 mb-6 flex w-60 items-start justify-start'>
            <YellowIcon className='h-15 w-30' />
        </div>
    );
}

export function BridgeIcon() {
    return (
        <div className='h-15 mb-6 flex w-60 items-start justify-start'>
            <GreyIcon className='h-15 w-30 drop-shadow-md' />
        </div>
    );
}
