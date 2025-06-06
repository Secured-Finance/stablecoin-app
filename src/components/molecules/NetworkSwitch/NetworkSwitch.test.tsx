import { composeStories } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from 'src/test-utils.js';
import * as stories from './NetworkSwitch.stories';

const { Default } = composeStories(stories);

describe('MenuPopover component', () => {
    it('should have a button with text More', () => {
        render(
            <BrowserRouter>
                <Default />
            </BrowserRouter>
        );
        const button = screen.getByRole('button', { name: 'Calibration' });
        expect(button).toBeInTheDocument();
    });
});
