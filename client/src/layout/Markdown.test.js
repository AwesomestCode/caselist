import React from 'react';
import { assert } from 'chai';

import { wrappedRender as render, screen, waitFor } from '../setupTests';
// eslint-disable-next-line import/named
import Markdown from './Markdown';

global.fetch = jest.fn(() => Promise.resolve({ text: () => Promise.resolve('test') }));

describe('Markdown', () => {
    it('Renders a markdown component', async () => {
        render(<Markdown file='test' />);

        await waitFor(() => assert.isOk(screen.queryByText('test'), 'Markdown exists'));
    });
});
