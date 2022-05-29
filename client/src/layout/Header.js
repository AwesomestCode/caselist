import React, { useContext, useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

import { AuthContext } from '../helpers/auth';
import { useStore } from '../helpers/store';
import { useDeviceDetect } from '../helpers/mobile';

import SearchForm from '../search/SearchForm';

import styles from './Header.module.css';

const Header = () => {
    const auth = useContext(AuthContext);
    const { caselistData } = useStore();
    const { caselist } = useParams();
    const location = useLocation();
    const { isMobile } = useDeviceDetect();

    const [className, setClassName] = useState();

    // Set the header background based on the event/level combo
    useEffect(() => {
        setClassName(`header-${caselistData.level}-${caselistData.event}`);
    }, [caselistData.level, caselistData.event]);

    return (
        <header className={`${styles.header} ${styles[className]} ${isMobile && styles.mobile}`}>
            <h1><Link to="/">openCaselist</Link></h1>
            {
                auth.user?.loggedIn &&
                (caselist || location.pathname.includes('openev')) &&
                <SearchForm />
            }
            <div className={`${styles.menu} pure-menu`}>
                <ul>
                    {
                        auth.user?.loggedIn
                        && <li className="pure-menu-item"><Link to="/logout">Logout</Link></li>
                    }
                </ul>
            </div>
        </header>
    );
};

export default Header;
