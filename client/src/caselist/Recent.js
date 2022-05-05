import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadRecent } from '../helpers/api';

const Recent = () => {
    const [recentData, setRecentData] = useState([]);

    const { caselist } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (caselist) {
                    const response = await loadRecent(caselist);
                    setRecentData(response || []);
                }
            } catch (err) {
                setRecentData([]);
                console.log(err);
            }
        };
        fetchData();
    }, [caselist]);

    return (
        <div>
            <h1>Recently Modified</h1>
            <p>{JSON.stringify(recentData)}</p>
        </div>
    );
};

export default Recent;
