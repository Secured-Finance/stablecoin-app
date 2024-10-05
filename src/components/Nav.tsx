import Link from 'next/link';
import { Box, Flex } from 'theme-ui';

export const Nav: React.FC = () => {
    return (
        <Box
            as='nav'
            sx={{ display: ['none', 'flex'], alignItems: 'center', flex: 1 }}
        >
            <Flex>
                <Link href='/'>Dashboard</Link>
            </Flex>
            <Flex sx={{ justifyContent: 'flex-end', mr: 3, flex: 1 }}>
                <Link href='/risky-troves'>Risky Troves</Link>
            </Flex>
        </Box>
    );
};
