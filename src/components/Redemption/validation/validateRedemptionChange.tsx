import {
    Decimal,
    MINIMUM_NET_DEBT,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import Link from 'next/link';
import { ActionDescription, Amount } from 'src/components/ActionDescription';
import { Alert } from 'src/components/atoms';
import { DOCUMENTATION_LINKS } from 'src/constants';
import { COIN } from 'src/strings';

export const selectForRedemptionChangeValidation = ({
    debtTokenBalance,
    price,
}: SfStablecoinStoreState) => ({
    debtTokenBalance,
    price,
});

type RedemptionChangeValidationContext = ReturnType<
    typeof selectForRedemptionChangeValidation
>;

export const validateRedemptionChange = (
    debtToken: Decimal,
    estimatedDebtToken: Decimal,
    hintsPending: boolean,
    fee: Decimal,
    { debtTokenBalance, price }: RedemptionChangeValidationContext
): [isValid: boolean, description: JSX.Element | undefined] => {
    if (debtToken.gt(debtTokenBalance)) {
        return [
            false,
            <Alert color='error' key={0}>
                The amount you&apos;re trying to redeem exceeds your balance by{' '}
                {debtToken.sub(debtTokenBalance).prettify(2)} {COIN}.
            </Alert>,
        ];
    }

    if (!hintsPending) {
        if (!estimatedDebtToken.eq(debtToken)) {
            if (estimatedDebtToken.isZero) {
                return [
                    false,
                    <Alert color='error' key={0}>
                        Under current redemption limits, the minimum redemption
                        is{' '}
                        <Amount>
                            {MINIMUM_NET_DEBT.prettify(0)} {COIN}
                        </Amount>
                        . Please enter{' '}
                        <Amount>
                            {MINIMUM_NET_DEBT.prettify(0)} {COIN}
                        </Amount>{' '}
                        or more. Learn more about redemption limits at the{' '}
                        <Link
                            className='font-semibold text-primary-500'
                            href={DOCUMENTATION_LINKS.redemption}
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label='USDFC Redemption'
                        >
                            Secured Finance Docs
                        </Link>
                        .
                    </Alert>,
                ];
            } else {
                return [
                    true,
                    <>
                        <Alert color='warning' key={0}>
                            Your redemption amount was adjusted to{' '}
                            <Amount>
                                {estimatedDebtToken.prettify(2)} {COIN}
                            </Amount>
                            . Under current redemption limits, amounts between{' '}
                            <Amount>{estimatedDebtToken.prettify(2)} </Amount>
                            and{' '}
                            <Amount>
                                {estimatedDebtToken
                                    .add(MINIMUM_NET_DEBT)
                                    .prettify(2)}{' '}
                                {COIN}{' '}
                            </Amount>
                            are not allowed. Learn more about redemption limits
                            at the{' '}
                            <Link
                                className='font-semibold text-primary-500'
                                href={DOCUMENTATION_LINKS.redemption}
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label='USDFC Redemption'
                            >
                                Secured Finance Docs
                            </Link>
                            .
                        </Alert>
                        <ActionDescription key={1}>
                            You will redeem{' '}
                            <Amount>
                                {estimatedDebtToken.prettify(2)} {COIN}
                            </Amount>{' '}
                            and receive{' '}
                            <Amount>
                                {estimatedDebtToken
                                    .div(price)
                                    .sub(fee)
                                    .prettify()}{' '}
                                tFIL
                            </Amount>{' '}
                            in return.
                        </ActionDescription>
                    </>,
                ];
            }
        }

        if (debtToken.nonZero) {
            return [
                true,
                <ActionDescription key={0}>
                    <>
                        You will redeem{' '}
                        <Amount>
                            {debtToken.prettify()} {COIN}
                        </Amount>{' '}
                        and receive{' '}
                        <Amount>
                            {debtToken.div(price).sub(fee).prettify()} tFIL
                        </Amount>{' '}
                        in return.
                    </>
                </ActionDescription>,
            ];
        }
    }

    return [false, undefined];
};
