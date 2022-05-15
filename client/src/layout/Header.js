import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { AuthContext } from '../helpers/auth';
import { useStore } from '../helpers/store';
import { useDeviceDetect } from '../helpers/mobile';

import styles from './Header.module.css';

const Header = () => {
    const auth = useContext(AuthContext);
    const { caselistData } = useStore();
    const { isMobile } = useDeviceDetect();

    const [q, setQ] = useState('');
    const navigate = useNavigate();

    const handleChangeInput = (e) => {
        setQ(e.currentTarget.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?q=${q}`);
    };

    // Set the header background based on the event/level combo
    const className = `header-${caselistData.level}-${caselistData.event}`;

    return (
        <header className={`${styles.header} ${styles[className]} ${isMobile && styles.mobile}`}>
            <h1><Link to="/">openCaselist</Link></h1>
            {
                auth.user?.loggedIn &&
                <form onSubmit={handleSearch} className={`${styles['pure-form']} ${styles.search}`}>
                    <input type="text" placeholder="Search" onChange={handleChangeInput} />
                    <button className="pure-button" type="submit">
                        <FontAwesomeIcon icon={faSearch} className={styles.search} />
                    </button>
                </form>
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
