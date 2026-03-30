import BlueIcon from 'src/assets/icons/blue.svg';
import GreyIcon from 'src/assets/icons/grey.svg';
import YellowIcon from 'src/assets/icons/yellow.svg';

export function BorrowIcon() {
    return (
        <div className='flex h-[60px] w-[242.67px] items-start justify-start'>
            <BlueIcon className='h-[60px] w-[120px]' />
        </div>
    );
}

export function EarnIcon() {
    return (
        <div className='flex h-[60px] w-[242.67px] items-start justify-start'>
            <YellowIcon className='h-[60px] w-[120px]' />
        </div>
    );
}

export function BridgeIcon() {
    return (
        <div className='flex h-[60px] w-[242.67px] items-start justify-start'>
            <GreyIcon className='h-[60px] w-[120px]' />
        </div>
    );
}
