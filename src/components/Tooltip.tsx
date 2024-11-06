import type { TippyProps } from '@tippyjs/react';
import Tippy from '@tippyjs/react';
import React from 'react';
import { Box, Card } from 'theme-ui';

export type TooltipProps = Pick<TippyProps, 'placement'> &
    React.PropsWithChildren<{
        message: React.ReactNode;
        link?: string;
    }>;

export type LearnMoreLinkProps = React.PropsWithChildren<
    Pick<TooltipProps, 'link'>
>;

export const LearnMoreLink: React.FC<LearnMoreLinkProps> = ({
    link,
    children,
}) => {
    return (
        <a
            href={link}
            target='_blank'
            className='font-semibold text-primary-500'
            rel='noreferrer'
        >
            {children ?? <>Learn more</>}
        </a>
    );
};

export const Tooltip: React.FC<TooltipProps> = ({
    children,
    message,
    placement = 'top',
    link,
}) => {
    return (
        <Tippy
            interactive={true}
            placement={placement}
            content={
                <Card variant='tooltip'>
                    {message}
                    {link && (
                        <Box mt={1}>
                            <LearnMoreLink link={link} />
                        </Box>
                    )}
                </Card>
            }
        >
            <span className='flex items-center'>{children}</span>
        </Tippy>
    );
};
