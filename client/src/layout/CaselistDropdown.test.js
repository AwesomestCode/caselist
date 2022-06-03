import React from 'react';
import { assert } from 'chai';

import { wrappedRender as render, screen, fireEvent, waitFor } from '../setupTests';
import { loadCaselists } from '../helpers/api';
import CaselistDropdown from './CaselistDropdown';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockImplementation(() => ({ caselist: 'testcaselist' })),
}));

describe('CaselistDropdown', () => {
    it('Renders a states dropdown and triggers the change handler', async () => {
        render(<CaselistDropdown />);
        await waitFor(() => assert.isOk(document.querySelectorAll('select'), 'Select exists'));
        assert.strictEqual(document.querySelectorAll('select').length, 2, 'Two selects');

        assert.strictEqual(loadCaselists.mock.calls.length, 1, 'Fetched caselists');

        await waitFor(() => assert.isOk(screen.queryByText('2022-2023'), 'Year option exists'));
        fireEvent.change(document.querySelector('select[name="year"]'), { target: { value: '2022' } });
        assert.strictEqual(document.querySelector('select[name="year"]').value, '2022', 'Correct year value');

        await waitFor(() => assert.isOk(screen.queryByText('Test Caselist'), 'Caselist option exists'));
        fireEvent.change(document.querySelector('select[name="caselist"]'), { target: { value: 'testcaselist' } });
        assert.strictEqual(document.querySelector('select[name="caselist"]').value, 'testcaselist', 'Correct caselist value');
        assert.strictEqual(document.title, 'openCaselist - Test Caselist', 'Correct document title');
    });

    it('Handles failure to fetch caselists', async () => {
        loadCaselists.mockRejectedValue(() => { throw new Error('Failed to fetch caselists'); });
        render(<CaselistDropdown />);

        await waitFor(() => assert.isOk(screen.queryByText('Choose a Caselist'), 'Select still renders'));
    });
});
