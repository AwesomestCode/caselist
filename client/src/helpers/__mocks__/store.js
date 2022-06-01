import React, { createContext, useContext } from 'react';

// Create a context for the store
export const StoreContext = createContext();

export const store = {
    fetchCaselist: jest.fn().mockResolvedValue({}),
    caselistData: { caselist_id: 1, name: 'Test', event: 'cx', level: 'hs' },
    fetchSchools: jest.fn().mockResolvedValue([]),
    schools: [],
    fetchSchool: jest.fn().mockResolvedValue({}),
    schoolData: {},
    fetchTeams: jest.fn().mockResolvedValue({}),
    teams: [],
    fetchOpenEvFiles: jest.fn().mockResolvedValue([]),
    openEvFiles: [],
};

// Store Context provider
export const ProvideStore = ({ children }) => {
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
