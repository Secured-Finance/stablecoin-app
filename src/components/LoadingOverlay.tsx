import React from 'react';
import { Container, Spinner } from 'theme-ui';

export const LoadingOverlay: React.FC = () => (
    <Container
        className='px-3 py-3 laptop:px-4 laptop:py-4'
        variant='disabledOverlay'
        sx={{
            display: 'flex',
            justifyContent: 'flex-end',
        }}
    >
        <Spinner size={32} className='p-[5px]' sx={{ color: '#002133' }} />
    </Container>
);
