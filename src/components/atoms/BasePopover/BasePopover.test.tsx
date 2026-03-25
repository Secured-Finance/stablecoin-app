import { render, screen } from '@testing-library/react';
import * as stories from './BasePopover.stories';
import { composeStories } from '@storybook/react';
const { Default } = composeStories(stories);

describe('BasePopover component', () => {
    it('should render button label', () => {
        render(<Default />);
        expect(screen.getByText('Options')).toBeInTheDocument();
    });
});
