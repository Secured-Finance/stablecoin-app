import React from 'react';
import SFLogoSmall from 'src/assets/img/small-logo.svg';
import { Box } from 'theme-ui';

type SecuredFinanceLogoProps = React.ComponentProps<typeof Box> & {
    height?: number | string;
};

export const SecuredFinanceLogo: React.FC<SecuredFinanceLogoProps> = ({
    ...boxProps
}) => (
    <Box sx={{ lineHeight: 0 }} {...boxProps}>
        <SFLogoSmall className='inline h-8 w-8' />
    </Box>
);
