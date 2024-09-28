import Link from 'next/link';
import { Box, Flex } from 'theme-ui';

// const TemporaryNewBadge = () => {
//     const isBeforeNovember2022 = new Date() < new Date('2022-11-01');
//     if (!isBeforeNovember2022) return null;
//     return (
//         <Badge ml={1} sx={{ fontSize: '12px' }}>
//             New
//         </Badge>
//     );
// };

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
                <Link href='/risky-troves' className='text-3'>
                    Risky Troves
                </Link>
            </Flex>
        </Box>
    );
};
