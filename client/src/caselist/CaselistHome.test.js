import React from 'react';
import { assert } from 'chai';

import { wrappedRender as render, screen, waitFor } from '../setupTests';
import CaselistHome from './CaselistHome';
// eslint-disable-next-line import/named
import { store } from '../helpers/store';

describe('CaselistHome', () => {
    it('Renders a caselist homepage', async () => {
        render(<CaselistHome />);
        await waitFor(() => assert.isOk(screen.queryByText('Test Caselist'), 'Heading exists'));
    });

    it('Renders an error message without caselistData', async () => {
        const defaultCaselistData = store.caselistData;
        store.caselistData = { message: 'No caselistData' };
        render(<CaselistHome />);
        await waitFor(() => assert.isOk(screen.queryAllByText('No caselistData'), 'Error message exists'));
        store.caselistData = defaultCaselistData;
    });
});
