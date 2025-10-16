import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ProtocolStats.stories';

const { Default } = composeStories(stories);

describe('test StatItem component', () => {
    it('should render button with a text', () => {
        render(<Default />);
        const BorrowingFeeElements = screen.getAllByText('Borrowing Fee');
        expect(BorrowingFeeElements[0]).toBeInTheDocument();
    });
});
