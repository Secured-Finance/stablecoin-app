import {
    Decimal,
    Decimalish,
    ProtocolTokenStake,
    SfStablecoinStoreState,
} from '@secured-finance/stablecoin-lib-base';
import {
    SfStablecoinStoreUpdate,
    useSfStablecoinReducer,
    useSfStablecoinSelector,
} from 'src/hooks';
import { GT } from 'src/strings';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { Alert } from 'src/components/atoms';
import { StakingManagerAction } from 'src/components/Staking/StakingManagerAction';

type StakeManagerState = {
    originalStake: ProtocolTokenStake;
    editedProtocolToken: Decimal;
};

type StakeManagerAction =
    | SfStablecoinStoreUpdate
    | { type: 'revert' }
    | { type: 'setStake'; newValue: Decimalish };

export default function Stake() {
    const { isConnected } = useAccount();
    const { open } = useWeb3Modal();

    const protocolTokenBalance = useSfStablecoinSelector(
        state => state.protocolTokenBalance
    );

    const [{ originalStake, editedProtocolToken }, dispatch] =
        useSfStablecoinReducer<
            StakeManagerState,
            StakeManagerAction,
            SfStablecoinStoreState
        >(
            (state, action) => {
                const { originalStake, editedProtocolToken } = state;

                switch (action.type) {
                    case 'setStake':
                        return {
                            ...state,
                            editedProtocolToken: Decimal.from(action.newValue),
                        };
                    case 'revert':
                        return {
                            ...state,
                            editedProtocolToken:
                                originalStake.stakedProtocolToken,
                        };
                    case 'updateStore': {
                        const updated = action.stateChange.protocolTokenStake;
                        if (updated) {
                            return {
                                originalStake: updated,
                                editedProtocolToken: updated.apply(
                                    originalStake.whatChanged(
                                        editedProtocolToken
                                    )
                                ),
                            };
                        }
                        break;
                    }
                }

                return state;
            },
            (storeState: SfStablecoinStoreState) => ({
                originalStake: storeState.protocolTokenStake,
                editedProtocolToken:
                    storeState.protocolTokenStake.stakedProtocolToken,
            })
        );

    const change = originalStake.whatChanged(editedProtocolToken);
    const validChange =
        change && !change.stakeProtocolToken?.gt(protocolTokenBalance)
            ? change
            : undefined;

    const stakeOverBalance = change?.stakeProtocolToken
        ?.sub(protocolTokenBalance)
        .prettify();

    const maxStake = protocolTokenBalance?.toString() ?? '0';

    const handleMaxStake = () => {
        dispatch({ type: 'setStake', newValue: maxStake });
    };

    return (
        <div className='flex min-w-full flex-col'>
            <main className='flex flex-grow flex-col items-center px-4 py-16'>
                <div className='mx-auto w-full max-w-3xl'>
                    <h1 className='text-2xl mb-2 text-center font-bold'>
                        Stake SFC
                    </h1>
                    <p className='mb-8 text-center text-sm text-[#565656]'>
                        Stake SFC, the governance token, to earn a share of
                        borrowing and redemption fees.
                    </p>

                    <div className='mx-auto max-w-md'>
                        <div className='mb-6 rounded-xl border border-[#e3e3e3] bg-white p-4'>
                            <div className='mb-2 text-sm font-medium'>
                                Stake
                            </div>
                            <div className='mb-1 flex items-center justify-between'>
                                <input
                                    className='text-3xl mr-2 w-full bg-transparent font-medium focus:outline-none'
                                    value={editedProtocolToken.toString()}
                                    onChange={e => {
                                        const value = e.target.value;
                                        dispatch({
                                            type: 'setStake',
                                            newValue: value,
                                        });
                                    }}
                                    placeholder='0.00'
                                    type='number'
                                />
                                <div className='inline-flex shrink-0 items-center rounded-full border border-gray-200 px-2 py-1'>
                                    <div className='mr-2 h-6 w-6 rounded-full bg-gradient-to-b from-[#676CFF] to-[#2B2C5C]' />
                                    <span className='text-sm font-medium text-[#0A1A2F]'>
                                        SFC
                                    </span>
                                </div>
                            </div>

                            {isConnected && (
                                <div className='mt-1 flex items-center justify-between'>
                                    <div className='text-sm text-[#565656]'>
                                        $
                                        {Number(
                                            editedProtocolToken.toString() || 0
                                        ).toFixed(2)}
                                    </div>
                                    <div className='text-sm'>
                                        {maxStake} SFC
                                        <button onClick={handleMaxStake}>
                                            <span className='ml-1 cursor-pointer text-[#1a30ff]'>
                                                Max
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {change?.stakeProtocolToken?.gt(
                                protocolTokenBalance
                            ) && (
                                <div className='mt-3'>
                                    <Alert>
                                        The amount you are trying to stake
                                        exceeds your balance by{' '}
                                        <span className='font-medium'>
                                            {stakeOverBalance} {GT}
                                        </span>
                                        .
                                    </Alert>
                                </div>
                            )}
                        </div>

                        {isConnected ? (
                            validChange ? (
                                <StakingManagerAction change={validChange}>
                                    <button className='mb-3 w-full rounded-xl bg-[#1a30ff] py-3.5 font-medium text-white'>
                                        Stake SFC
                                    </button>
                                </StakingManagerAction>
                            ) : (
                                <button
                                    disabled
                                    className='mb-3 w-full rounded-xl bg-gray-300 py-3.5 font-medium text-white'
                                >
                                    Enter Valid Amount
                                </button>
                            )
                        ) : (
                            <button
                                className='mb-3 w-full rounded-xl bg-[#1a30ff] py-3.5 font-medium text-white'
                                onClick={() => open()}
                            >
                                Connect Wallet
                            </button>
                        )}

                        <p className='text-center text-xs text-[#565656]'>
                            This action will open your wallet to sign the
                            transaction.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
