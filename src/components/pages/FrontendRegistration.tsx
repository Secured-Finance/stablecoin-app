import { Decimal } from '@secured-finance/stablecoin-lib-base';
import { useState } from 'react';
import { Transaction, useMyTransactionState } from 'src/components/Transaction';
import { useSfStablecoin } from 'src/hooks';
import { AddressUtils } from 'src/utils';
import { Button, Input, Label, Spinner } from 'theme-ui';
import { Alert } from '../atoms';
import { CardComponent } from '../templates';

type FrontendRegistrationActionProps = {
    kickbackRate: Decimal;
};

const FrontendRegistrationAction: React.FC<FrontendRegistrationActionProps> = ({
    kickbackRate,
}) => {
    const {
        sfStablecoin: { send: sfStablecoin },
    } = useSfStablecoin();

    const myTransactionId = 'register-frontend';
    const myTransactionState = useMyTransactionState(myTransactionId);

    return myTransactionState.type === 'waitingForApproval' ? (
        <Button disabled>
            <Spinner
                sx={{ mr: 2, color: 'white' }}
                size={20}
                className='inline-block'
            />
            Waiting for your approval
        </Button>
    ) : myTransactionState.type !== 'waitingForConfirmation' &&
      myTransactionState.type !== 'confirmed' ? (
        <Transaction
            id={myTransactionId}
            send={sfStablecoin.registerFrontend.bind(
                sfStablecoin,
                kickbackRate
            )}
        >
            <Button>Register</Button>
        </Transaction>
    ) : null;
};

export const FrontendRegistration: React.FC = () => {
    const { account } = useSfStablecoin();

    const [kickbackRate, setKickbackRate] = useState(Decimal.from(0.8));
    const [cut, setCut] = useState(Decimal.from(0.2));
    const [kickbackRateString, setKickbackRateString] = useState('80');

    return (
        <section className='flex flex-col gap-6 pt-5 laptop:pt-6'>
            <CardComponent title='Choose a kickback rate'>
                <div className='typography-desktop-body-4 flex flex-col gap-3'>
                    <div className='flex'>
                        <Label>Kickback rate</Label>
                        <Label variant='unit'>%</Label>

                        <Input
                            className='shadow-none max-w-[200px]'
                            type='number'
                            step='any'
                            value={kickbackRateString}
                            onChange={e => {
                                setKickbackRateString(e.target.value);
                                try {
                                    const newKickbackRate = Decimal.from(
                                        e.target.value || 0
                                    ).div(100);
                                    const newCut =
                                        Decimal.ONE.sub(newKickbackRate);

                                    setKickbackRate(newKickbackRate);
                                    setCut(newCut);
                                } catch {}
                            }}
                            onBlur={() => {
                                setKickbackRateString(
                                    kickbackRate.mul(100).toString()
                                );
                            }}
                        />
                    </div>

                    <Alert color='warning'>
                        <p>
                            You are about to register{' '}
                            <b>{AddressUtils.format(account, 6)}</b> to receive{' '}
                            <b>{cut.mul(100).toString()}%</b> of the SCR rewards
                            earned through this frontend.
                        </p>
                        <p>
                            You will not be able to change the kickback rate for
                            this address later.
                        </p>
                        <p>
                            If you would like to use a different kickback rate
                            in the future, you will need to repeat this
                            registration with a different address.
                        </p>
                    </Alert>
                </div>
            </CardComponent>

            <FrontendRegistrationAction {...{ kickbackRate }} />
        </section>
    );
};
