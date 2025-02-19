import {
    CRITICAL_COLLATERAL_RATIO,
    Decimal,
    Difference,
    Percent,
} from '@secured-finance/stablecoin-lib-base';
import clsx from 'clsx';
import React from 'react';
import AlertIcon from 'src/assets/icons/alert-fill.svg';
import CheckIcon from 'src/assets/icons/check.svg';
import { Alert } from 'src/components/atoms';
import { DOCUMENTATION_LINKS } from 'src/constants';
import { COIN } from 'src/strings';
import { Card } from 'theme-ui';
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
    const color = value?.gt(CRITICAL_COLLATERAL_RATIO)
        ? 'text-success-700'
        : value?.gt(1.2)
        ? 'text-warning-700'
        : value?.lte(1.2)
        ? 'text-error-700'
        : 'text-neutral-300';
    return (
        <>
            <div className='flex items-center gap-2 px-3'>
                {!value || value?.gt(CRITICAL_COLLATERAL_RATIO) ? (
                    <CheckIcon className={clsx('h-7 w-7', color)} />
                ) : (
                    <AlertIcon className={clsx('h-7 w-7', color)} />
                )}
                <StaticRow
                    label='Collateral ratio'
                    inputId='trove-collateral-ratio'
                    amount={collateralRatioPct.prettify()}
                    color={color}
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
                                    The ratio between the dollar value of the
                                    collateral and the debt (in {COIN}) you are
                                    depositing. While the Minimum Collateral
                                    Ratio is 110% during normal operation, it is
                                    recommended to keep the Collateral Ratio
                                    always above 150% to avoid liquidation under
                                    Recovery Mode. A Collateral Ratio above 200%
                                    or 250% is recommended for additional
                                    safety.
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
                <Alert color='info'>
                    Keep your collateral ratio above 150% to avoid being{' '}
                    <LearnMoreLink link={DOCUMENTATION_LINKS.liquidation}>
                        liquidated
                    </LearnMoreLink>{' '}
                    under{' '}
                    <LearnMoreLink link={DOCUMENTATION_LINKS.recoveryMode}>
                        Recovery Mode.
                    </LearnMoreLink>
                </Alert>
            )}
        </>
    );
};
