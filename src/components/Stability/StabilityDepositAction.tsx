import {
    Decimal,
    SfStablecoinStoreState,
    StabilityDepositChange,
} from '@secured-finance/lib-base';
import { Button, ButtonSizes } from 'src/components/atoms';
import {
    useBreakpoint,
    useSfStablecoin,
    useSfStablecoinSelector,
} from 'src/hooks';
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
    const isMobile = useBreakpoint('tablet');
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

    return (
        <Button
            onClick={sendTransaction}
            size={isMobile ? ButtonSizes.sm : undefined}
        >
            {children}
        </Button>
    );
};
