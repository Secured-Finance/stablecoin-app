import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ProtocolStats.stories';

const { Default } = composeStories(stories);

describe('test ProtocolStats component', () => {
    it('should render button with a text', () => {
        render(<Default />);
        const Borrowing_Fee = screen.getByText('Borrowing Fee');
        expect(Borrowing_Fee).toBeInTheDocument();
    });
});
