import type { StoryContext, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import 'src/bigIntPatch';
import { config } from './../src/stories/mocks/mockWallet';
// import { connectWallet, updateBalance } from 'src/store/wallet';
// import { account, connector, publicClient } from 'src/stories/mocks/mockWallet';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { useDispatch } from 'react-redux';
import { Header } from 'src/components/organisms/Header/Header';
import { Layout } from 'src/components/templates';
import { updateChainError } from 'src/store/blockchain';
import timemachine from 'timemachine';
import { WagmiProvider } from 'wagmi';

export const withAppLayout = (Story: StoryFn) => {
    return (
        <Layout navBar={<Header />}>
            <Story />
        </Layout>
    );
};

export const withWalletProvider = (Story: StoryFn, Context: StoryContext) => {
    createWeb3Modal({
        wagmiConfig: config,
        projectId: '',
        enableAnalytics: false,
    });

    return (
        <WagmiProvider config={config}>
            <Story />
        </WagmiProvider>
    );
};

export const withMockDate = (Story: StoryFn, context: StoryContext) => {
    if (context?.parameters?.date?.value instanceof Date) {
        timemachine.config({
            dateString: context.parameters.date.value,
            tick: true,
        });
    }

    return <Story />;
};

// export const withBalance = (Story: StoryFn) => {
//     const dispatch = useDispatch();
//     useEffect(() => {
//         const timeoutId = setTimeout(() => {
//             dispatch(updateBalance('2000000000000000000000'));
//         }, 300);

//         return () => clearTimeout(timeoutId);
//     }, [dispatch]);

//     return <Story />;
// };

export const withChainErrorEnabled = (Story: StoryFn) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(updateChainError(true));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [dispatch]);

    return <Story />;
};
