import { Flex, Heading, Spinner } from 'theme-ui';

export const AppLoader = () => (
    <Flex
        sx={{ alignItems: 'center', justifyContent: 'center', height: '100vh' }}
    >
        <Spinner sx={{ m: 2, color: '#002133' }} size={32} />
        <Heading sx={{ color: '#002133' }}>Loading...</Heading>
    </Flex>
);
