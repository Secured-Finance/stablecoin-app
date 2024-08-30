import {
    Chain,
    TransactionReceipt,
    WaitForTransactionReceiptParameters,
    createPublicClient,
    createWalletClient,
    http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';

const privateKey =
    '0xde926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3';

export const account = privateKeyToAccount(privateKey);

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
});

publicClient.waitForTransactionReceipt = async (
    args: WaitForTransactionReceiptParameters<Chain>
) => {
    return {
        blockNumber: args.hash ? BigInt('123') : BigInt('0'),
    } as unknown as TransactionReceipt;
};

export const walletClient = createWalletClient({
    account: account,
    chain: sepolia,
    transport: http(),
});

const connector = mock({
    accounts: [account.address],
});

export const config = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(),
    },
    connectors: [connector],
});
