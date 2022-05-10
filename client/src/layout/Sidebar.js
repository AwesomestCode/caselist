import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { startOfYear } from '@speechanddebate/nsda-js-utils';

import { useStore } from '../helpers/store';
import CaselistDropdown from './CaselistDropdown';
import StatesDropdown from '../caselist/StatesDropdown';

import styles from './Sidebar.module.css';

const Sidebar = () => {
    const { caselist } = useParams();
    const { schools, fetchSchools, caselistData, fetchCaselist } = useStore();

    useEffect(() => {
        fetchCaselist(caselist);
        fetchSchools(caselist);
    }, [caselist, fetchCaselist, fetchSchools]);

    const [stateCode, setStateCode] = useState('');

    const [visible, setVisible] = useState(true);
    const handleToggleVisible = () => {
        setVisible(!visible);
    };

    if (!caselistData.name) { return false; }

    const filteredSchools = stateCode ? schools.filter(s => s.state === stateCode) : schools;

    return (
        <div className={`${styles.sidebar} ${!visible ? styles['sidebar-collapsed'] : undefined}`}>
            <div className={styles.toggle} onClick={handleToggleVisible} title="Click to toggle sidebar">
                <span>{visible ? '«' : '»'}</span>
            </div>
            <div className={!visible ? styles['sidebar-contents-collapsed'] : undefined}>
                <CaselistDropdown />
                {
                    caselistData.archived
                    ? <p>THIS CASELIST IS ARCHIVED, NO CHANGES ARE ALLOWED</p>
                    : false
                }
                <h2>
                    <span>Schools </span>
                    {
                        !caselistData.archived && caselistData.year === startOfYear &&
                        <Link to={`/${caselist}/add`}>
                            <button type="button" className={`${styles['add-school']} pure-button`}>
                                <FontAwesomeIcon className={styles.plus} icon={faPlus} />
                                <span> Add</span>
                            </button>
                        </Link>
                    }
                </h2>
                {
                    caselistData.level === 'hs' &&
                    <form className="pure-form">
                        <label htmlFor="state">State</label>
                        <StatesDropdown
                            required={false}
                            stateCode={stateCode}
                            changeStateCode={e => setStateCode(e.currentTarget.value)}
                        />
                    </form>
                }
                {
                    !caselistData.archived &&
                    <p>
                        <Link to={`/${caselist}/recent`}>Recently Modified</Link>
                    </p>
                }
                {
                    filteredSchools && filteredSchools.length > 0 &&
                        <div>
                            <ul>
                                {
                                    filteredSchools.map(s => {
                                        return (
                                            <li key={s.school_id}>
                                                <Link to={`/${caselist}/${s.name}`}>
                                                    {s.display_name}
                                                    {caselistData.level === 'hs' && ` (${s.state})`}
                                                </Link>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                }
            </div>
        </div>
    );
};

export default Sidebar;
