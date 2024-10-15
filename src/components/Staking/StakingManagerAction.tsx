import { Decimal, LQTYStakeChange } from '@secured-finance/lib-base';
import { useLiquity } from 'src/hooks';
import { Button } from 'theme-ui';
import { useTransactionFunction } from '../Transaction';

type StakingActionProps = React.PropsWithChildren<{
    change: LQTYStakeChange<Decimal>;
}>;

export const StakingManagerAction: React.FC<StakingActionProps> = ({
    change,
    children,
}) => {
    const { liquity } = useLiquity();

    const [sendTransaction] = useTransactionFunction(
        'stake',
        change.stakeLQTY
            ? liquity.send.stakeLQTY.bind(liquity.send, change.stakeLQTY)
            : liquity.send.unstakeLQTY.bind(liquity.send, change.unstakeLQTY)
    );

    return <Button onClick={sendTransaction}>{children}</Button>;
};
