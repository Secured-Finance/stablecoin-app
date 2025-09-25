import { useSfStablecoinSelector } from 'src/hooks';
import {
    SfStablecoinStoreState,
    Decimal,
} from '@secured-finance/stablecoin-lib-base';
import FILIcon from 'src/assets/icons/filecoin-network.svg';
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
                color: 'text-success-700',
                bg: 'bg-success-100',
                dotBg: 'bg-success-500',
            };
        const ratioPercent = ratio.mul(100);
        if (ratioPercent.gte(200))
            return {
                text: 'Very Low',
                color: 'text-success-700',
                bg: 'bg-success-100',
                dotBg: 'bg-success-500',
            };
        if (ratioPercent.gte(150))
            return {
                text: 'Low',
                color: 'text-success-700',
                bg: 'bg-success-100',
                dotBg: 'bg-success-500',
            };
        if (ratioPercent.gte(120))
            return {
                text: 'Medium',
                color: 'text-warning-700',
                bg: 'bg-warning-100',
                dotBg: 'bg-warning-500',
            };
        return {
            text: 'High',
            color: 'text-error-700',
            bg: 'bg-error-100',
            dotBg: 'bg-error-500',
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
                        <span className='text-sm'>FIL</span>
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
                            className={`ml-2 inline-flex items-center gap-2 rounded-full px-3 py-1 ${liquidationRisk.bg}`}
                        >
                            <div
                                className={`h-2 w-2 rounded-full ${liquidationRisk.dotBg}`}
                            ></div>
                            <span
                                className={`text-xs ${liquidationRisk.color}`}
                            >
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
