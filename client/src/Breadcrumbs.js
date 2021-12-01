import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useStore } from './store';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
    const { caselist, school, team } = useParams();
    const { caselist: caselistData } = useStore();

    // TODO - make it work when starting on a subpage
    return (
        <div className="breadcrumbs">
            <Link to="/">
                <FontAwesomeIcon
                    className="home"
                    icon={faHome}
                />
            </Link>

            {caselist && <Link to={`/${caselist}`}><span> / {caselistData.name}</span></Link>}
            {school && <Link to={`/${caselist}/${school}`}><span> / {school}</span></Link>}
            {team && <Link to={`/${caselist}/${school}/${team}`}><span> / {team}</span></Link>}
        </div>
    );
};

export default Breadcrumbs;