import { Decimal, TroveChange } from '@secured-finance/lib-base';
import { useLiquity } from 'src/hooks';
import { Button } from 'theme-ui';
import { useTransactionFunction } from '../Transaction';

type TroveActionProps = React.PropsWithChildren<{
    transactionId: string;
    change: Exclude<TroveChange<Decimal>, { type: 'invalidCreation' }>;
    maxBorrowingRate: Decimal;
    borrowingFeeDecayToleranceMinutes: number;
}>;

export const TroveAction: React.FC<TroveActionProps> = ({
    children,
    transactionId,
    change,
    maxBorrowingRate,
    borrowingFeeDecayToleranceMinutes,
}) => {
    const { liquity } = useLiquity();

    const [sendTransaction] = useTransactionFunction(
        transactionId,
        change.type === 'creation'
            ? liquity.send.openTrove.bind(liquity.send, change.params, {
                  maxBorrowingRate,
                  borrowingFeeDecayToleranceMinutes,
              })
            : change.type === 'closure'
            ? liquity.send.closeTrove.bind(liquity.send)
            : liquity.send.adjustTrove.bind(liquity.send, change.params, {
                  maxBorrowingRate,
                  borrowingFeeDecayToleranceMinutes,
              })
    );

    return <Button onClick={sendTransaction}>{children}</Button>;
};
