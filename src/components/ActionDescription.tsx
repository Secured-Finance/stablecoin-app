import { Text } from 'theme-ui';

export const ActionDescription: React.FC<React.PropsWithChildren> = ({
    children,
}) => (
    <div className='flex items-center'>
        <p className='typography-desktop-body-5'>{children}</p>
    </div>
);

export const Amount: React.FC<React.PropsWithChildren> = ({ children }) => (
    <Text sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{children}</Text>
);
