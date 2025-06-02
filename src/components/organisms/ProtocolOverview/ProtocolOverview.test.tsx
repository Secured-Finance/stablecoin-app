import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './ProtocolOverview.stories';

const { Default } = composeStories(stories);

describe('test StatItem component', () => {
    it('should render button with a text', () => {
        render(<Default />);
    });
});
