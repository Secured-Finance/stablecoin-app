import {
    CRITICAL_COLLATERAL_RATIO,
    Decimal,
    MINIMUM_COLLATERAL_RATIO,
    Percent,
    UserTrove,
} from '@secured-finance/lib-base';
import { BlockPolledSfStablecoinStoreState } from '@secured-finance/lib-ethers';
import clsx from 'clsx';
import { t } from 'i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import CheckIcon from 'src/assets/icons/check.svg';
import Clipboard from 'src/assets/icons/clipboard-line.svg';
import RedoIcon from 'src/assets/icons/refresh.svg';
import TrashIcon from 'src/assets/icons/trash.svg';
import { Tooltip } from 'src/components/atoms';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import {
    AddressUtils,
    COLLATERAL_PRECISION,
    DEBT_TOKEN_PRECISION,
} from 'src/utils';
import { COIN } from '../strings';
import { Abbreviation } from './Abbreviation';
import { LoadingOverlay } from './LoadingOverlay';
import { Transaction } from './Transaction';

const liquidatableInNormalMode = (trove: UserTrove, price: Decimal) =>
    [
        trove.collateralRatioIsBelowMinimum(price),
        t('card-component.ratio-not-low'),
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

            navigator.clipboard.writeText(copied);

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

    const colClassName =
        'w-1/4 text-3.5 leading-4.5 laptop:text-xs laptop:leading-3.5 laptop:w-[21%] h-full table-cell align-middle';

    return (
        <div className='relative flex flex-col rounded-b-xl bg-neutral-50 text-neutral-900 shadow-card'>
            <div className='flex h-10 items-center justify-between border-t-2 border-primary-500 bg-neutral-200 px-3.5 py-2 text-3.5 font-semibold leading-5.5 tablet:border-t-4 laptop:h-[42px] laptop:px-3.5 laptop:text-base'>
                <h2>{t('common.risky-troves')}</h2>
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

            <div className='px-3 pb-4 pt-3 text-neutral-800 laptop:px-4'>
                {!troves || troves.length === 0 ? (
                    <div>
                        {!troves
                            ? `${t('common.loading')}...`
                            : 'There are no Troves yet'}
                    </div>
                ) : (
                    <table className='w-full'>
                        <colgroup>
                            <col style={{ width: '50px' }} />
                            <col />
                            <col />
                            <col />
                            <col />
                        </colgroup>

                        <thead>
                            <tr>
                                <th
                                    className={clsx(
                                        colClassName,
                                        'text-left laptop:text-center'
                                    )}
                                >
                                    {t('common.owner')}
                                </th>
                                <th
                                    className={clsx(
                                        colClassName,
                                        'text-center'
                                    )}
                                >
                                    <span className='flex justify-center laptop:hidden'>
                                        Coll.
                                    </span>
                                    <span className='hidden justify-center laptop:flex'>
                                        {t('common.collateral')}
                                    </span>
                                    <span className='text-xs font-normal leading-4 text-neutral-500'>
                                        tFIL
                                    </span>
                                </th>
                                <th className={colClassName}>
                                    <span className='flex justify-center'>
                                        {t('common.debt')}
                                    </span>
                                    <span className='text-xs font-normal leading-4 text-neutral-500'>
                                        {COIN}
                                    </span>
                                </th>
                                <th
                                    className={clsx(
                                        colClassName,
                                        'pr-2 text-right laptop:pr-0 laptop:text-center'
                                    )}
                                >
                                    {t('common.collateral-ratio')}
                                </th>
                                <th className='text-3.5 leading-4.5 laptop:text-xs laptop:leading-5'></th>
                            </tr>
                        </thead>

                        <tbody>
                            {troves.map(
                                trove =>
                                    !trove.isEmpty && ( // making sure the Trove hasn't been liquidated
                                        // (WONT-FIX: remove check after we can fetch multiple Troves in one call)
                                        <tr
                                            key={trove.ownerAddress}
                                            className='typography-mobile-body-4 laptop:typography-desktop-body-5 h-[30px] laptop:h-8'
                                        >
                                            <td>
                                                <div className='flex items-center gap-1 laptop:justify-center'>
                                                    <Tooltip
                                                        iconElement={
                                                            <span className='min-w-[100px] font-numerical font-medium'>
                                                                {AddressUtils.format(
                                                                    trove.ownerAddress,
                                                                    6
                                                                )}
                                                            </span>
                                                        }
                                                        placement={'top'}
                                                    >
                                                        {trove.ownerAddress}
                                                    </Tooltip>

                                                    <button
                                                        onClick={() =>
                                                            setCopied(
                                                                trove.ownerAddress
                                                            )
                                                        }
                                                    >
                                                        {copied ===
                                                        trove.ownerAddress ? (
                                                            <CheckIcon className='text-success-700' />
                                                        ) : (
                                                            <Clipboard />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className='text-center'>
                                                <Abbreviation
                                                    short={trove.collateral.shorten()}
                                                >
                                                    {trove.collateral.prettify(
                                                        COLLATERAL_PRECISION
                                                    )}
                                                </Abbreviation>
                                            </td>
                                            <td className='text-center'>
                                                <Abbreviation
                                                    short={trove.debt.shorten()}
                                                >
                                                    {trove.debt.prettify(
                                                        DEBT_TOKEN_PRECISION
                                                    )}
                                                </Abbreviation>
                                            </td>
                                            <td>
                                                {(collateralRatio => (
                                                    <span
                                                        className={clsx(
                                                            collateralRatio.gt(
                                                                CRITICAL_COLLATERAL_RATIO
                                                            )
                                                                ? 'text-success-700'
                                                                : collateralRatio.gt(
                                                                      1.2
                                                                  )
                                                                ? 'text-warning-700'
                                                                : 'text-error-700',
                                                            'block pr-2 text-right laptop:pr-0 laptop:text-center'
                                                        )}
                                                    >
                                                        {new Percent(
                                                            collateralRatio
                                                        ).prettify()}
                                                    </span>
                                                ))(
                                                    trove.collateralRatio(price)
                                                )}
                                            </td>
                                            <td>
                                                <div className='flex justify-center laptop:justify-end'>
                                                    <Transaction
                                                        id={`liquidate-${trove.ownerAddress}`}
                                                        tooltip={t(
                                                            'common.liquidate'
                                                        )}
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
                                                        <button className='text-error-500 disabled:text-neutral-400'>
                                                            <TrashIcon className='h-4 w-4' />
                                                        </button>
                                                    </Transaction>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {loading && <LoadingOverlay />}
        </div>
    );
};
