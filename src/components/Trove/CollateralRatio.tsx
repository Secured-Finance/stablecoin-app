import {
    CRITICAL_COLLATERAL_RATIO,
    Decimal,
    Difference,
    Percent,
} from '@secured-finance/lib-base';
import { t } from 'i18next';
import React from 'react';
import { Trans } from 'react-i18next';
import HeartIcon from 'src/assets/icons/heart.svg';
import { Card } from 'theme-ui';
import { InfoBubble } from '../InfoBubble';
import { InfoIcon } from '../InfoIcon';
import { LearnMoreLink } from '../Tooltip';
import { StaticRow } from './Editor';

type CollateralRatioProps = {
    value?: Decimal;
    change?: Difference;
};

export const CollateralRatio: React.FC<CollateralRatioProps> = ({
    value,
    change,
}) => {
    const collateralRatioPct = new Percent(value ?? { toString: () => 'N/A' });
    const changePct = change && new Percent(change);
    return (
        <>
            <div className='flex items-center gap-2'>
                <HeartIcon className='h-8 w-8' />

                <StaticRow
                    label={t('common.collateral-ratio')}
                    inputId='trove-collateral-ratio'
                    amount={collateralRatioPct.prettify()}
                    color={
                        value?.gt(CRITICAL_COLLATERAL_RATIO)
                            ? 'text-success-700'
                            : value?.gt(1.2)
                            ? 'text-warning-700'
                            : value?.lte(1.2)
                            ? 'text-error-700'
                            : 'text-neutral-300'
                    }
                    pendingAmount={
                        change?.positive?.absoluteValue?.gt(10)
                            ? '++'
                            : change?.negative?.absoluteValue?.gt(10)
                            ? '--'
                            : changePct?.nonZeroish(2)?.prettify()
                    }
                    pendingColor={
                        change?.positive ? 'text-success-700' : 'text-error-700'
                    }
                    infoIcon={
                        <InfoIcon
                            message={
                                <Card variant='tooltip' sx={{ width: '220px' }}>
                                    {t('tooltips.collateral-ratio')}
                                </Card>
                            }
                        />
                    }
                />
            </div>
        </>
    );
};

type CollateralRatioInfoBubbleProps = {
    value?: Decimal;
    change?: Difference;
};

export const CollateralRatioInfoBubble: React.FC<
    CollateralRatioInfoBubbleProps
> = ({ value }) => {
    return (
        <>
            {value?.lt(1.5) && (
                <InfoBubble>
                    <Trans i18nKey='card-component.collateral-ratio-warning'>
                        Keep your collateral ratio above 150% to avoid being{' '}
                        <LearnMoreLink link='https://docs.secured.finance/stablecoin-protocol-guide/key-features/stability-pool-and-liquidation#what-are-liquidations'>
                            liquidated
                        </LearnMoreLink>{' '}
                        under{' '}
                        <LearnMoreLink link='https://docs.secured.finance/stablecoin-protocol-guide/key-features/recovery-mode'>
                            Recovery Mode.
                        </LearnMoreLink>
                    </Trans>
                </InfoBubble>
            )}
        </>
    );
};
