import {
    CRITICAL_COLLATERAL_RATIO,
    Decimal,
    MINIMUM_COLLATERAL_RATIO,
    Percent,
    UserTrove,
} from '@secured-finance/lib-base';
import { BlockPolledSfStablecoinStoreState } from '@secured-finance/lib-ethers';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import RedoIcon from 'src/assets/icons/refresh.svg';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { AddressUtils } from 'src/utils';
import { Box, Button, Text } from 'theme-ui';
import { COIN } from '../strings';
import { Abbreviation } from './Abbreviation';
import { Icon } from './Icon';
import { LoadingOverlay } from './LoadingOverlay';
import { Tooltip } from './Tooltip';
import { Transaction } from './Transaction';

const rowHeight = '40px';

const liquidatableInNormalMode = (trove: UserTrove, price: Decimal) =>
    [
        trove.collateralRatioIsBelowMinimum(price),
        'Collateral ratio not low enough',
    ] as const;

const liquidatableInRecoveryMode = (
    trove: UserTrove,
    price: Decimal,
    totalCollateralRatio: Decimal,
    debtTokenInStabilityPool: Decimal
) => {
    const collateralRatio = trove.collateralRatio(price);

    if (
        collateralRatio.gte(MINIMUM_COLLATERAL_RATIO) &&
        collateralRatio.lt(totalCollateralRatio)
    ) {
        return [
            trove.debt.lte(debtTokenInStabilityPool),
            "There's not enough token in the Stability pool to cover the debt",
        ] as const;
    } else {
        return liquidatableInNormalMode(trove, price);
    }
};

type RiskyTrovesProps = {
    pageSize: number;
};

const select = ({
    numberOfTroves,
    price,
    total,
    debtTokenInStabilityPool,
    blockTag,
}: BlockPolledSfStablecoinStoreState) => ({
    numberOfTroves,
    price,
    recoveryMode: total.collateralRatioIsBelowCritical(price),
    totalCollateralRatio: total.collateralRatio(price),
    debtTokenInStabilityPool,
    blockTag,
});

export const RiskyTroves: React.FC<RiskyTrovesProps> = ({ pageSize }) => {
    const {
        blockTag,
        numberOfTroves,
        recoveryMode,
        totalCollateralRatio,
        debtTokenInStabilityPool,
        price,
    } = useSfStablecoinSelector(select);
    const { sfStablecoin } = useSfStablecoin();

    const [loading, setLoading] = useState(true);
    const [troves, setTroves] = useState<UserTrove[]>();

    const [reload, setReload] = useState({});
    const forceReload = useCallback(() => setReload({}), []);

    const [page, setPage] = useState(0);
    const numberOfPages = Math.ceil(numberOfTroves / pageSize) || 1;
    const clampedPage = Math.min(page, numberOfPages - 1);

    const nextPage = () => {
        if (clampedPage < numberOfPages - 1) {
            setPage(clampedPage + 1);
        }
    };

    const previousPage = () => {
        if (clampedPage > 0) {
            setPage(clampedPage - 1);
        }
    };

    useEffect(() => {
        if (page !== clampedPage) {
            setPage(clampedPage);
        }
    }, [page, clampedPage]);

    useEffect(() => {
        let mounted = true;

        setLoading(true);

        sfStablecoin
            .getTroves(
                {
                    first: pageSize,
                    sortedBy: 'ascendingCollateralRatio',
                    startingAt: clampedPage * pageSize,
                },
                { blockTag }
            )
            .then(troves => {
                if (mounted) {
                    setTroves(troves);
                    setLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
        // Omit blockTag from deps on purpose
        // eslint-disable-next-line
    }, [sfStablecoin, clampedPage, pageSize, reload]);

    useEffect(() => {
        forceReload();
    }, [forceReload, numberOfTroves]);

    const [copied, setCopied] = useState<string>();

    useEffect(() => {
        if (copied !== undefined) {
            let cancelled = false;

            setTimeout(() => {
                if (!cancelled) {
                    setCopied(undefined);
                }
            }, 2000);

            return () => {
                cancelled = true;
            };
        }
    }, [copied]);

    return (
        <div className='relative flex flex-col rounded-b-xl bg-neutral-50 text-neutral-900 shadow-card'>
            <div className='flex h-10 items-center justify-between border-t-2 border-primary-500 bg-neutral-200 px-3.5 py-2 text-3.5 font-semibold leading-5.5 tablet:border-t-4 laptop:h-[42px] laptop:px-3.5 laptop:text-base'>
                <h2>Risky Troves</h2>
                <div className='flex items-center gap-1'>
                    {numberOfTroves !== 0 && (
                        <>
                            <span className='typography-desktop-body-5 font-normal text-neutral-800'>
                                {clampedPage * pageSize + 1}-
                                {Math.min(
                                    (clampedPage + 1) * pageSize,
                                    numberOfTroves
                                )}{' '}
                                of {numberOfTroves}
                            </span>

                            <button
                                onClick={previousPage}
                                disabled={clampedPage <= 0}
                                className='disabled:text-neutral-400'
                            >
                                <ChevronLeft className='h-5 w-5' />
                            </button>

                            <button
                                onClick={nextPage}
                                disabled={clampedPage >= numberOfPages - 1}
                                className='disabled:text-neutral-400'
                            >
                                <ChevronRight className='h-5 w-5' />
                            </button>
                        </>
                    )}

                    <button
                        className={clsx({
                            'opacity-0': loading,
                        })}
                        onClick={forceReload}
                    >
                        <RedoIcon className='h-5 w-5' />
                    </button>
                </div>
            </div>

            {!troves || troves.length === 0 ? (
                <div className='pb-4 pt-3'>
                    <Box sx={{ p: 4, fontSize: 3, textAlign: 'center' }}>
                        {!troves ? 'Loading...' : 'There are no Troves yet'}
                    </Box>
                </div>
            ) : (
                <div className='pb-4 pt-3'>
                    <Box
                        as='table'
                        sx={{
                            mt: 2,
                            pl: [1, 4],
                            width: '100%',

                            textAlign: 'center',
                            lineHeight: 1.15,
                        }}
                    >
                        <colgroup>
                            <col style={{ width: '50px' }} />
                            <col />
                            <col />
                            <col />
                            <col style={{ width: rowHeight }} />
                        </colgroup>

                        <thead>
                            <tr>
                                <th>Owner</th>
                                <th>
                                    <Abbreviation short='Coll.'>
                                        Collateral
                                    </Abbreviation>
                                    <Box
                                        sx={{
                                            fontSize: [0, 1],
                                            fontWeight: 'body',
                                            opacity: 0.5,
                                        }}
                                    >
                                        tFIL
                                    </Box>
                                </th>
                                <th>
                                    Debt
                                    <Box
                                        sx={{
                                            fontSize: [0, 1],
                                            fontWeight: 'body',
                                            opacity: 0.5,
                                        }}
                                    >
                                        {COIN}
                                    </Box>
                                </th>
                                <th>
                                    Coll.
                                    <br />
                                    Ratio
                                </th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {troves.map(
                                trove =>
                                    !trove.isEmpty && ( // making sure the Trove hasn't been liquidated
                                        // (WONT-FIX: remove check after we can fetch multiple Troves in one call)
                                        <tr key={trove.ownerAddress}>
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    height: rowHeight,
                                                }}
                                            >
                                                <Tooltip
                                                    message={trove.ownerAddress}
                                                    placement='top'
                                                >
                                                    <Text
                                                        variant='address'
                                                        sx={{
                                                            width: [
                                                                '73px',
                                                                'unset',
                                                            ],
                                                            overflow: 'hidden',
                                                            position:
                                                                'relative',
                                                        }}
                                                    >
                                                        {AddressUtils.format(
                                                            trove.ownerAddress,
                                                            6
                                                        )}
                                                        <Box
                                                            sx={{
                                                                display: [
                                                                    'block',
                                                                    'none',
                                                                ],
                                                                position:
                                                                    'absolute',
                                                                top: 0,
                                                                right: 0,
                                                                width: '50px',
                                                                height: '100%',
                                                                background:
                                                                    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
                                                            }}
                                                        />
                                                    </Text>
                                                </Tooltip>

                                                <div>
                                                    <Button
                                                        variant='icon'
                                                        sx={{
                                                            width: '24px',
                                                            height: '24px',
                                                        }}
                                                    >
                                                        <Icon
                                                            name={
                                                                copied ===
                                                                trove.ownerAddress
                                                                    ? 'clipboard-check'
                                                                    : 'clipboard'
                                                            }
                                                            size='sm'
                                                        />
                                                    </Button>
                                                </div>
                                            </td>
                                            <td>
                                                <Abbreviation
                                                    short={trove.collateral.shorten()}
                                                >
                                                    {trove.collateral.prettify(
                                                        4
                                                    )}
                                                </Abbreviation>
                                            </td>
                                            <td>
                                                <Abbreviation
                                                    short={trove.debt.shorten()}
                                                >
                                                    {trove.debt.prettify()}
                                                </Abbreviation>
                                            </td>
                                            <td>
                                                {(collateralRatio => (
                                                    <Text
                                                        color={
                                                            collateralRatio.gt(
                                                                CRITICAL_COLLATERAL_RATIO
                                                            )
                                                                ? 'success'
                                                                : collateralRatio.gt(
                                                                      1.2
                                                                  )
                                                                ? 'warning'
                                                                : 'danger'
                                                        }
                                                    >
                                                        {new Percent(
                                                            collateralRatio
                                                        ).prettify()}
                                                    </Text>
                                                ))(
                                                    trove.collateralRatio(price)
                                                )}
                                            </td>
                                            <td>
                                                <Transaction
                                                    id={`liquidate-${trove.ownerAddress}`}
                                                    tooltip='Liquidate'
                                                    requires={[
                                                        recoveryMode
                                                            ? liquidatableInRecoveryMode(
                                                                  trove,
                                                                  price,
                                                                  totalCollateralRatio,
                                                                  debtTokenInStabilityPool
                                                              )
                                                            : liquidatableInNormalMode(
                                                                  trove,
                                                                  price
                                                              ),
                                                    ]}
                                                    send={sfStablecoin.send.liquidate.bind(
                                                        sfStablecoin.send,
                                                        trove.ownerAddress
                                                    )}
                                                >
                                                    <Button variant='dangerIcon'>
                                                        <Icon name='trash' />
                                                    </Button>
                                                </Transaction>
                                            </td>
                                        </tr>
                                    )
                            )}
                        </tbody>
                    </Box>
                </div>
            )}

            {loading && <LoadingOverlay />}
        </div>
    );
};
