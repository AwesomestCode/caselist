import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
    const { caselist, school, team } = useParams();

    // TODO - hook in to store for display text
    return (
        <div className="breadcrumbs">
            <Link to="/">
                <FontAwesomeIcon
                    className="home"
                    icon={faHome}
                />
            </Link>

            {caselist && <Link to={`/${caselist}`}><span> / {caselist}</span></Link>}
            {school && <Link to={`/${caselist}/${school}`}><span> / {school}</span></Link>}
            {team && <Link to={`/${caselist}/${school}/${team}`}><span> / {team}</span></Link>}
        </div>
    );
};

export default Breadcrumbs;
