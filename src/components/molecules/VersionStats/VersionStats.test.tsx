import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './VersionStats.stories';

const { Default } = composeStories(stories);

describe('test VersionStats component', () => {
    it('should render button with a text', () => {
        render(<Default />);
        const button = screen.getByTestId('link-arrow');
        expect(button).toBeInTheDocument();
    });
});
