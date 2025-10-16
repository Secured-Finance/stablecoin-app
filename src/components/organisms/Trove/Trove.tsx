import {
    Decimal,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
import { USDFCIcon } from 'src/components/SecuredFinanceLogo';
import { useSfStablecoinSelector } from 'src/hooks';
import { CURRENCY } from 'src/strings';

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
                containerStyle: 'bg-success-50 border border-success-100',
                textStyle: 'text-success-700 text-sm font-medium',
                dotStyle: 'bg-success-500',
            };
        const ratioPercent = ratio.mul(100);
        if (ratioPercent.gte(200))
            return {
                text: 'Very Low',
                containerStyle: 'bg-success-50 border border-success-100',
                textStyle: 'text-success-700 text-sm font-medium',
                dotStyle: 'bg-success-500',
            };
        if (ratioPercent.gte(150))
            return {
                text: 'Low',
                containerStyle: 'bg-success-50 border border-success-100',
                textStyle: 'text-success-700 text-sm font-medium',
                dotStyle: 'bg-success-500',
            };
        if (ratioPercent.gte(120))
            return {
                text: 'Medium',
                containerStyle: 'bg-[#FFF7E0] border border-[#FFE4A3]',
                textStyle: 'text-warning-700 text-sm font-medium',
                dotStyle: 'bg-warning-500',
            };
        return {
            text: 'High',
            containerStyle: 'bg-[#FFE4E1] border border-[#FFACA3]',
            textStyle: 'text-error-700 text-sm font-medium',
            dotStyle: 'bg-error-500',
        };
    };

    const collateralRatio = trove.collateralRatio(price);
    const liquidationRisk = getLiquidationRisk(collateralRatio);

    return (
        <div className='mb-6 rounded-[20px] border border-neutral-150 bg-white p-6'>
            <div className='grid grid-cols-1 gap-8 tablet:grid-cols-2'>
                {/* Total Debt */}
                <div className='flex flex-col items-start gap-3'>
                    <div className='font-primary text-4 font-medium leading-[19px] text-neutral-450'>
                        Total Debt
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='font-primary text-4 font-medium leading-[19px] text-neutral-900'>
                            {trove.debt.prettify()}
                        </span>
                        <USDFCIcon className='h-4 w-4' />
                        <span className='font-primary text-4 font-normal leading-[19px] text-neutral-900'>
                            USDFC
                        </span>
                    </div>
                </div>

                {/* Collateral */}
                <div className='flex flex-col items-start gap-3'>
                    <div className='font-primary text-4 font-medium leading-[19px] text-neutral-450'>
                        Collateral
                    </div>
                    <div className='flex min-w-0 items-center gap-4'>
                        <div className='flex min-w-0 items-center gap-2'>
                            <span className='truncate font-primary text-4 font-medium leading-[19px] text-neutral-900'>
                                {trove.collateral.prettify()}
                            </span>
                            <FILIcon className='h-4 w-4 shrink-0' />
                            <span className='whitespace-nowrap font-primary text-4 font-normal leading-[19px] text-neutral-900'>
                                {CURRENCY}
                            </span>
                        </div>
                        <span className='whitespace-nowrap font-primary text-sm font-normal leading-[17px] text-neutral-450'>
                            ${trove.collateral.mul(price).prettify()}
                        </span>
                    </div>
                </div>

                {/* Collateral Ratio */}
                <div className='flex flex-col items-start gap-3'>
                    <div className='font-primary text-4 font-medium leading-[19px] text-neutral-450'>
                        Collateral Ratio
                    </div>
                    <div className='flex items-center gap-3'>
                        <span className='font-primary text-4 font-medium leading-[19px] text-neutral-900'>
                            {collateralRatio
                                ? `${collateralRatio.mul(100).prettify()}%`
                                : '150%'}
                        </span>
                        <div
                            className={`flex items-center rounded-full ${liquidationRisk.containerStyle}`}
                            style={{
                                padding: '3px 8px 3px 3px',
                                gap: '4px',
                            }}
                        >
                            <div
                                className={`rounded-full ${liquidationRisk.dotStyle}`}
                                style={{ width: '16px', height: '16px' }}
                            ></div>
                            <span
                                className={`font-primary text-xs font-medium leading-[15px] tracking-[0.01em] ${liquidationRisk.textStyle}`}
                            >
                                {liquidationRisk.text} Liquidation Risk
                            </span>
                        </div>
                    </div>
                </div>

                {/* Debt in Front */}
                <div className='flex flex-col items-start gap-3'>
                    <div className='font-primary text-4 font-medium leading-[19px] text-neutral-450'>
                        Debt in Front
                    </div>
                    <div className='truncate font-primary text-4 font-medium leading-[19px] text-neutral-900'>
                        ${debtInFrontAmount.prettify()}
                    </div>
                </div>
            </div>
        </div>
    );
};
