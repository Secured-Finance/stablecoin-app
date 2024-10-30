import { Decimal, TroveChange } from '@secured-finance/lib-base';
import { Button, ButtonSizes } from 'src/components/atoms';
import { useBreakpoint, useSfStablecoin } from 'src/hooks';
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
    const { sfStablecoin } = useSfStablecoin();
    const isMobile = useBreakpoint('tablet');

    const [sendTransaction] = useTransactionFunction(
        transactionId,
        change.type === 'creation'
            ? sfStablecoin.send.openTrove.bind(
                  sfStablecoin.send,
                  change.params,
                  {
                      maxBorrowingRate,
                      borrowingFeeDecayToleranceMinutes,
                  }
              )
            : change.type === 'closure'
            ? sfStablecoin.send.closeTrove.bind(sfStablecoin.send)
            : sfStablecoin.send.adjustTrove.bind(
                  sfStablecoin.send,
                  change.params,
                  {
                      maxBorrowingRate,
                      borrowingFeeDecayToleranceMinutes,
                  }
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
