import { useSfStablecoinSelector } from 'src/hooks';
import {
    SfStablecoinStoreState,
    Decimal,
} from '@secured-finance/stablecoin-lib-base';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { CURRENCY } from 'src/strings';
import { USDFCIcon } from 'src/components/SecuredFinanceLogo';

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

export const Trove = () => {
    const {
        trove,
        price,
        debtInFront: [debtInFrontAmount],
    } = useSfStablecoinSelector(select);

    const getLiquidationRisk = (ratio?: Decimal) => {
        if (!ratio)
            return {
                text: 'Low',
                containerStyle: 'bg-[#DFFEE0] border border-[#C9FDCA]',
                textStyle: 'text-[#023103] text-sm font-medium',
                dotStyle: 'bg-[#84FA86]',
            };
        const ratioPercent = ratio.mul(100);
        if (ratioPercent.gte(200))
            return {
                text: 'Very Low',
                containerStyle: 'bg-[#DFFEE0] border border-[#C9FDCA]',
                textStyle: 'text-[#023103] text-sm font-medium',
                dotStyle: 'bg-[#84FA86]',
            };
        if (ratioPercent.gte(150))
            return {
                text: 'Low',
                containerStyle: 'bg-[#DFFEE0] border border-[#C9FDCA]',
                textStyle: 'text-[#023103] text-sm font-medium',
                dotStyle: 'bg-[#84FA86]',
            };
        if (ratioPercent.gte(120))
            return {
                text: 'Medium',
                containerStyle: 'bg-[#FFF7E0] border border-[#FFE4A3]',
                textStyle: 'text-[#5C2E00] text-sm font-medium',
                dotStyle: 'bg-[#FFAD00]',
            };
        return {
            text: 'High',
            containerStyle: 'bg-[#FFE4E1] border border-[#FFACA3]',
            textStyle: 'text-[#5C0000] text-sm font-medium',
            dotStyle: 'bg-[#FF4D4F]',
        };
    };

    const collateralRatio = trove.collateralRatio(price);
    const liquidationRisk = getLiquidationRisk(collateralRatio);

    return (
        <div className='mb-6 rounded-xl border border-neutral-9 bg-white p-6'>
            <div className='grid grid-cols-1 gap-4 tablet:grid-cols-2 tablet:gap-6'>
                <div>
                    <p className='mb-1 text-sm text-neutral-450'>Total Debt</p>
                    <div className='flex items-center gap-1'>
                        <span className='font-bold'>
                            {trove.debt.prettify()}
                        </span>
                        <USDFCIcon />
                        <span className='text-sm'>USDFC</span>
                    </div>
                </div>
                <div>
                    <p className='mb-1 text-sm text-neutral-450'>Collateral</p>
                    <div className='flex items-center gap-1'>
                        <span className='font-bold'>
                            {trove.collateral.prettify()}
                        </span>
                        <FILIcon className='h-4 w-4' />
                        <span className='text-sm'>{CURRENCY}</span>
                        <span className='ml-1 text-sm text-neutral-450'>
                            ${trove.collateral.mul(price).sub(0).prettify()}
                        </span>
                    </div>
                </div>
                <div>
                    <p className='mb-1 text-sm text-neutral-450'>
                        Collateral Ratio
                    </p>
                    <div className='flex items-center gap-1'>
                        <span className='font-bold'>
                            {collateralRatio
                                ? `${collateralRatio.mul(100).prettify()}%`
                                : '150%'}
                        </span>
                        <div
                            className={`ml-2 inline-flex items-center rounded-full ${liquidationRisk.containerStyle}`}
                            style={{ padding: '6px 12px 6px 6px', gap: '6px' }}
                        >
                            <div
                                className={`rounded-full ${liquidationRisk.dotStyle}`}
                                style={{ width: '16px', height: '16px' }}
                            ></div>
                            <span className={liquidationRisk.textStyle}>
                                {liquidationRisk.text} Liquidation Risk
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <p className='mb-1 text-sm text-neutral-450'>
                        Debt in Front
                    </p>
                    <div className='font-bold'>
                        ${debtInFrontAmount.prettify()}
                    </div>
                </div>
            </div>
        </div>
    );
};
