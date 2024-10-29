import { Flex, Text } from 'theme-ui';

export const ActionDescription: React.FC<React.PropsWithChildren> = ({
    children,
}) => (
    <Flex sx={{ alignItems: 'center' }}>
        <p className='typography-desktop-body-5'>{children}</p>
    </Flex>
);

export const Amount: React.FC<React.PropsWithChildren> = ({ children }) => (
    <Text sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{children}</Text>
);
