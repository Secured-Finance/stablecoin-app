import { useSfStablecoinSelector } from 'src/hooks';
import { SecuredFinanceLogo } from '../SecuredFinanceLogo';
import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';

import FILIcon from 'src/assets/icons/filecoin-network.svg';

const select = ({
    trove,
    fees,
    price,
    debtInFront,
}: SfStablecoinStoreState) => ({
    trove,
    price,
    debtInFront,
    fees,
});

export const YourTrove = () => {
    const {
        trove,
        price,
        debtInFront: [debtInFrontAmount],
    } = useSfStablecoinSelector(select);

    return (
        <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-6'>
            <div className='grid grid-cols-2 gap-6'>
                <div>
                    <p className='mb-1 text-sm text-[#565656]'>Total Debt</p>
                    <div className='flex items-center gap-1'>
                        <span className='font-bold'>
                            {trove.debt.prettify()}
                        </span>
                        <SecuredFinanceLogo />
                    </div>
                </div>
                <div>
                    <p className='mb-1 text-sm text-[#565656]'>Collateral</p>
                    <div className='flex items-center gap-1'>
                        <span className='font-bold'>
                            {trove.collateral.prettify()}
                        </span>
                        <FILIcon />
                        <span className='text-sm'>FIL</span>
                        <span className='ml-1 text-xs text-[#565656]'>
                            {trove.collateral.div(price).sub(0).prettify()}
                        </span>
                    </div>
                </div>
                <div>
                    <p className='mb-1 text-sm text-[#565656]'>
                        Collateral Ratio
                    </p>
                    <div className='flex items-center gap-1'>
                        <span className='font-bold'>
                            {trove.collateralRatio(price).mul(100).prettify()}%
                        </span>
                        <div className='ml-2 flex items-center gap-1'>
                            <div className='h-2 w-2 rounded-full bg-green-500'></div>
                            <span className='text-xs text-green-700'>
                                Low Liquidation Risk
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <p className='mb-1 text-sm text-[#565656]'>Debt in Front</p>
                    <div className='font-bold'>
                        ${debtInFrontAmount.prettify()}
                    </div>
                </div>
            </div>
        </div>
    );
};
