import { useLiquitySelector } from '@liquity/lib-react';
import {
    Decimal,
    LiquityStoreState,
    StabilityDepositChange,
} from '@secured-finance/lib-base';
import { Button } from 'theme-ui';

import { useLiquity } from '../../hooks/LiquityContext';
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
        change.depositLUSD
            ? liquity.send.depositLUSDInStabilityPool.bind(
                  liquity.send,
                  change.depositLUSD,
                  frontendTag
              )
            : liquity.send.withdrawLUSDFromStabilityPool.bind(
                  liquity.send,
                  change.withdrawLUSD
              )
    );

    return <Button onClick={sendTransaction}>{children}</Button>;
};
