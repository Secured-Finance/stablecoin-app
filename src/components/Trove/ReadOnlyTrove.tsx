import { AddressZero } from '@ethersproject/constants';
import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import React, { useCallback } from 'react';
import { Button, ButtonVariants } from 'src/components/atoms';
import { CardComponent } from 'src/components/templates';
import { useSfStablecoinSelector } from 'src/hooks';
import { COLLATERAL_PRECISION, ordinaryFormat } from 'src/utils';
import { Card, Paragraph, Text } from 'theme-ui';
import { COIN, CURRENCY } from '../../strings';
import { Icon } from '../Icon';
import { InfoIcon } from '../InfoIcon';
import { CollateralRatio, CollateralRatioInfoBubble } from './CollateralRatio';
import { useTroveView } from './context/TroveViewContext';
import { DisabledEditableRow } from './Editor';

const select = ({ trove, price, debtInFront }: SfStablecoinStoreState) => ({
    trove,
    price,
    debtInFront,
});

export const ReadOnlyTrove: React.FC = () => {
    const { dispatchEvent } = useTroveView();
    const handleAdjustTrove = useCallback(() => {
        dispatchEvent('ADJUST_TROVE_PRESSED');
    }, [dispatchEvent]);
    const handleCloseTrove = useCallback(() => {
        dispatchEvent('CLOSE_TROVE_PRESSED');
    }, [dispatchEvent]);

    const {
        trove,
        price,
        debtInFront: [debtInFrontAmount, debtInFrontNextAddress],
    } = useSfStablecoinSelector(select);

    // console.log("READONLY TROVE", trove.collateral.prettify(4));
    return (
        <CardComponent
            title={
                <>
                    Trove
                    <div className='typography-mobile-body-4 flex flex-row gap-2 rounded-lg bg-neutral-200 px-2 py-1'>
                        <div className='typography-desktop-body-5 flex items-center gap-1 text-neutral-600'>
                            Debt in front{' '}
                            <InfoIcon
                                message={
                                    <Card
                                        variant='tooltip'
                                        sx={{ width: '240px' }}
                                    >
                                        <Paragraph>
                                            <Text sx={{ fontWeight: 'bold' }}>
                                                &quot;Debt in front&quot;
                                            </Text>{' '}
                                            represents the sum of the {COIN}{' '}
                                            debt of all Troves with a lower
                                            collateral ratio than you.
                                        </Paragraph>
                                        <Paragraph>
                                            This metric shows how much {COIN}{' '}
                                            must be redeemed before your Trove
                                            is affected.
                                        </Paragraph>
                                    </Card>
                                }
                            ></InfoIcon>
                        </div>
                        <div className='font-semibold'>{`${
                            // Note: `debtInFrontNextAddress !== AddressZero` means there is more Trove that has not been accounted for in `debtInFrontAmount`.
                            ordinaryFormat(
                                Number(debtInFrontAmount.toString()) || 0,
                                0,
                                debtInFrontNextAddress === AddressZero ? 2 : 0,
                                'compact'
                            ) +
                            (debtInFrontNextAddress === AddressZero ? '' : '+')
                        } ${COIN}`}</div>
                    </div>
                </>
            }
            actionComponent={
                <>
                    <Button
                        variant={ButtonVariants.secondary}
                        onClick={handleCloseTrove}
                    >
                        Close Trove
                    </Button>
                    <Button
                        variant={ButtonVariants.primary}
                        onClick={handleAdjustTrove}
                    >
                        <Icon name='pen' size='sm' />
                        &nbsp;Adjust
                    </Button>
                </>
            }
        >
            <div className='flex flex-col gap-3'>
                <DisabledEditableRow
                    label='Collateral'
                    inputId='trove-collateral'
                    amount={trove.collateral.prettify(COLLATERAL_PRECISION)}
                    unit={CURRENCY}
                />

                <DisabledEditableRow
                    label='Debt'
                    inputId='trove-debt'
                    amount={trove.debt.prettify()}
                    unit={COIN}
                />

                <CollateralRatio value={trove.collateralRatio(price)} />
                <CollateralRatioInfoBubble
                    value={trove.collateralRatio(price)}
                />
            </div>
        </CardComponent>
    );
};
