import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { ProvideAuth } from './helpers/auth';
import { ProvideStore } from './helpers/store';

jest.mock('./helpers/auth');
jest.mock('./helpers/store');
jest.mock('./helpers/api');
jest.mock('./helpers/useScript');

global.window.scrollTo = () => true;
global.window.URL.createObjectURL = () => '';

export const wrappedRender = (component) => {
    return render(
        <ProvideAuth>
            <MemoryRouter>
                <ProvideStore>
                    {component}
                </ProvideStore>
            </MemoryRouter>
            <ToastContainer />
        </ProvideAuth>
    );
};

export * from '@testing-library/react';

export default null;
