import InformationIcon from 'src/assets/icons/information-circle.svg';
import { Box, Flex, Heading, Text } from 'theme-ui';

type InfoMessageProps = React.PropsWithChildren<{
    title?: string;
    icon?: React.ReactNode;
}>;

export const InfoMessage: React.FC<InfoMessageProps> = ({
    title,
    children,
    icon,
}) => (
    <Box sx={{ mx: 1, mb: 3 }}>
        {title && (
            <Flex sx={{ alignItems: 'center', mb: '10px' }}>
                <Box sx={{ mr: '12px', fontSize: '20px' }}>
                    {icon || (
                        <InformationIcon className='h-4 w-4 text-neutral-500' />
                    )}
                </Box>

                <Heading as='h3'>{title}</Heading>
            </Flex>
        )}

        <Text sx={{ fontSize: 1 }}>{children}</Text>
    </Box>
);
