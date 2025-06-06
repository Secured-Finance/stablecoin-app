import React from 'react';
import { BasePopover, Separator } from 'src/components/atoms';
import { NETWORK_LINKS } from 'src/constants';
import { getCurrentNetworkKey } from 'src/utils';

export const NetworkSwitch = () => {
    const currentKey = getCurrentNetworkKey();
    const currentNetwork = NETWORK_LINKS[currentKey];

    return (
        <div className='hidden w-[120px] items-center justify-center laptop:flex '>
            <BasePopover buttonLabel={<span>{currentNetwork.label}</span>}>
                {({ close }) => (
                    <>
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
                                        className='flex w-full items-center justify-between gap-2 px-3 py-2 text-3.5 text-neutral-900'
                                        role='menuitem'
                                    >
                                        <span>{label}</span>
                                        {key === currentKey && (
                                            <span className='h-2 w-2 rounded-full bg-success-500' />
                                        )}
                                    </button>
                                    {i !==
                                        Object.entries(NETWORK_LINKS).length -
                                            1 && (
                                        <div className='hidden laptop:block'>
                                            <Separator color='neutral-100' />
                                        </div>
                                    )}
                                </React.Fragment>
                            )
                        )}
                    </>
                )}
            </BasePopover>
        </div>
    );
};
