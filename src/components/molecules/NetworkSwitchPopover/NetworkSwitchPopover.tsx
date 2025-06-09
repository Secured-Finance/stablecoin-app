import React from 'react';
import { BasePopover, Separator } from 'src/components/atoms';
import { NETWORK_LINKS } from 'src/constants';
import { getCurrentNetworkKey } from 'src/utils';

export const NetworkSwitchPopover = () => {
    const currentKey = getCurrentNetworkKey();
    const currentNetwork = NETWORK_LINKS[currentKey];

    return (
        <div className='hidden w-[120px] items-center justify-center laptop:flex '>
            <BasePopover buttonLabel={currentNetwork.label}>
                {({ close }) => (
                    <div className='w-36 rounded-b-md bg-white py-1.5'>
                        {Object.values(NETWORK_LINKS).map(
                            ({ key, label, href }, i) => (
                                <React.Fragment key={key}>
                                    <button
                                        key={key}
                                        onClick={() => {
                                            if (window.location.href !== href) {
                                                window.location.href = href;
                                            }
                                            close();
                                        }}
                                        className='flex w-full items-center justify-between gap-2 bg-white px-3 py-2 text-3.5  text-neutral-900  hover:bg-neutral-100'
                                        role='menuitem'
                                    >
                                        <span className='typography-desktop-body-5 grow text-left text-neutral-800'>
                                            {label}
                                        </span>
                                        {key === currentKey && (
                                            <span className='h-2 w-2 rounded-full bg-success-500' />
                                        )}
                                    </button>
                                    {i !==
                                        Object.entries(NETWORK_LINKS).length -
                                            1 && (
                                        <Separator color='neutral-100' />
                                    )}
                                </React.Fragment>
                            )
                        )}
                    </div>
                )}
            </BasePopover>
        </div>
    );
};
