import React from 'react';
import PropTypes from 'prop-types';

import { affName, negName } from '@speechanddebate/nsda-js-utils';

const SideDropdown = ({ className, value, onChange, event = 'cx' }) => {
    return (
        <select className={className} name="side" value={value} onChange={onChange}>
            <option value="" />
            <option value="A">{affName(event)}</option>
            <option value="N">{negName(event)}</option>
        </select>
    );
};

SideDropdown.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    event: PropTypes.string,
};

export default SideDropdown;
