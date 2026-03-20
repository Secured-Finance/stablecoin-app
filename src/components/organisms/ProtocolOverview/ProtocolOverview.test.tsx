import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './ProtocolOverview.stories';

jest.mock('src/hooks', () => ({
    ...jest.requireActual('src/hooks'),
    useSfStablecoin: jest.fn(() => ({
        sfStablecoin: {
            send: {
                setPrice: jest.fn(),
            },
            connection: {
                _priceFeedIsTestnet: false,
            },
        },
        provider: {},
        config: {},
        account: '',
    })),
}));

jest.mock('wagmi', () => ({
    ...jest.requireActual('wagmi'),
    useAccount: jest.fn(() => ({
        isConnected: false,
        address: undefined,
    })),
}));

const { Default } = composeStories(stories);

describe('test ProtocolOverview', () => {
    it('should render button with a text', () => {
        render(<Default />);
    });
});
