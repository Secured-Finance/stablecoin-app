import {
    Decimal,
    LiquityStoreState,
    StabilityDepositChange,
} from '@secured-finance/lib-base';
import { useLiquity, useLiquitySelector } from 'src/hooks';
import { Button } from 'theme-ui';
import { useTransactionFunction } from '../Transaction';

type StabilityDepositActionProps = React.PropsWithChildren<{
    transactionId: string;
    change: StabilityDepositChange<Decimal>;
}>;

const selectFrontendRegistered = ({ frontend }: LiquityStoreState) =>
    frontend.status === 'registered';

export const StabilityDepositAction: React.FC<StabilityDepositActionProps> = ({
    children,
    transactionId,
    change,
}) => {
    const { config, liquity } = useLiquity();
    const frontendRegistered = useLiquitySelector(selectFrontendRegistered);

    const frontendTag = frontendRegistered ? config.frontendTag : undefined;

    const [sendTransaction] = useTransactionFunction(
        transactionId,
        change.depositDebtToken
            ? liquity.send.depositDebtTokenInStabilityPool.bind(
                  liquity.send,
                  change.depositDebtToken,
                  frontendTag
              )
            : liquity.send.withdrawDebtTokenFromStabilityPool.bind(
                  liquity.send,
                  change.withdrawDebtToken
              )
    );

    return <Button onClick={sendTransaction}>{children}</Button>;
};
