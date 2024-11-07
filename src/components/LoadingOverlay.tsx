import React from 'react';
import { Container, Spinner } from 'theme-ui';

export const LoadingOverlay: React.FC = () => (
    <Container
        variant='disabledOverlay'
        sx={{
            px: '14px',
            py: ['10px', '12px'],
            display: 'flex',
            justifyContent: 'flex-end',
        }}
    >
        <Spinner size={22} sx={{ color: '#002133' }} />
    </Container>
);
