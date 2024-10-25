import {
    Decimal,
    SfStablecoinStoreState,
    StabilityDepositChange,
} from '@secured-finance/lib-base';
import { Button } from 'src/components/atoms';
import { useSfStablecoin, useSfStablecoinSelector } from 'src/hooks';
import { useTransactionFunction } from '../Transaction';

type StabilityDepositActionProps = React.PropsWithChildren<{
    transactionId: string;
    change: StabilityDepositChange<Decimal>;
}>;

const selectFrontendRegistered = ({ frontend }: SfStablecoinStoreState) =>
    frontend.status === 'registered';

export const StabilityDepositAction: React.FC<StabilityDepositActionProps> = ({
    children,
    transactionId,
    change,
}) => {
    const { config, sfStablecoin } = useSfStablecoin();
    const frontendRegistered = useSfStablecoinSelector(
        selectFrontendRegistered
    );

    const frontendTag = frontendRegistered ? config.frontendTag : undefined;

    const [sendTransaction] = useTransactionFunction(
        transactionId,
        change.depositDebtToken
            ? sfStablecoin.send.depositDebtTokenInStabilityPool.bind(
                  sfStablecoin.send,
                  change.depositDebtToken,
                  frontendTag
              )
            : sfStablecoin.send.withdrawDebtTokenFromStabilityPool.bind(
                  sfStablecoin.send,
                  change.withdrawDebtToken
              )
    );

    return <Button onClick={sendTransaction}>{children}</Button>;
};
