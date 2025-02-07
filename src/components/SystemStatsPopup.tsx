import { SfStablecoinStoreState } from '@secured-finance/stablecoin-lib-base';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import InfoIcon from 'src/assets/icons/information-circle-fill.svg';
import { useSfStablecoinSelector } from 'src/hooks';
import { Container } from 'theme-ui';
import { SystemStats } from './SystemStats';

const select = ({ total, price }: SfStablecoinStoreState) => ({ total, price });

export const SystemStatsPopup: React.FC = () => {
    const { price, total } = useSfStablecoinSelector(select);

    const [systemStatsOpen, setSystemStatsOpen] = useState(false);
    const systemStatsOverlayRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <button
                className='flex h-8 items-center rounded-[8px] bg-neutral-50 px-2 ring-1 ring-neutral-300 hover:ring-primary-500 focus:outline-none active:bg-primary-300/30 laptop:hidden'
                onClick={() => setSystemStatsOpen(!systemStatsOpen)}
            >
                <InfoIcon
                    className={clsx('text-primary-500', {
                        'text-red-500':
                            total.collateralRatioIsBelowCritical(price),
                    })}
                />
            </button>

            {systemStatsOpen && (
                <Container
                    variant='infoOverlay'
                    ref={systemStatsOverlayRef}
                    onClick={e => {
                        if (e.target === systemStatsOverlayRef.current) {
                            setSystemStatsOpen(false);
                        }
                    }}
                    className='!flex items-center justify-center px-5'
                    backgroundColor='rgba(241, 245, 249, 0.8)'
                >
                    <SystemStats showBalances />
                </Container>
            )}
        </>
    );
};
