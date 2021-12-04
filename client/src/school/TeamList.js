import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { loadTeams, loadSchool, deleteTeam } from '../helpers/api';
// import TabroomChaptersDropdown from './TabroomChaptersDropdown';
import Table from '../tables/Table';
import './TeamList.css';

const TeamList = () => {
    const { caselist, school } = useParams();

    const [schoolData, setSchoolData] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                setSchoolData(await loadSchool(caselist, school));
            } catch (err) {
                setSchoolData({});
                console.log(err);
            }
        };
        fetchData();
    }, [caselist, school]);

    const [teams, setTeams] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setTeams(await loadTeams(caselist, school));
            } catch (err) {
                setTeams([]);
                console.log(err);
            }
        };
        fetchData();
    }, [caselist, school]);

    const handleDelete = useCallback(async (e) => {
        // eslint-disable-next-line no-alert
        alert(`Deleting team ${e.currentTarget.dataset.code}`);
        try {
            await deleteTeam(caselist, school, e.currentTarget.dataset.code);
        } catch (err) {
            console.log(err);
        }
    }, [caselist, school]);

    const data = useMemo(() => teams, [teams]);
    const columns = useMemo(() => [
        {
            Header: 'Team',
            accessor: row => row,
            Cell: (row) => {
                return (
                    <Link to={`/${caselist}/${school}/${row.value?.code}`}>
                        {row.value.name} (
                        <span>{row.value.debater1_first} </span>
                        <span>{row.value.debater1_last} </span>
                        <span>- </span>
                        <span>{row.value.debater2_first} </span>
                        <span>{row.value.debater2_last}</span>
                        )
                    </Link>
                );
            },
        },
        {
            id: 'delete',
            Header: '',
            accessor: (row) => row,
            className: 'center',
            Cell: (row) => (
                <FontAwesomeIcon
                    className="trash"
                    icon={faTrash}
                    data-code={row.value?.code}
                    onClick={e => handleDelete(e)}
                />
            ),
        },
    ], [caselist, school, handleDelete]);

    const timestamp = moment(schoolData.updated_at, 'YYYY-MM-DD HH:mm:ss').format('l');

    return (
        <div className="teamlist">
            <h1>{schoolData.display_name}</h1>
            <p className="timestamp">Last updated by {schoolData.updated_by} on {timestamp}</p>
            {/* <TabroomChaptersDropdown /> */}
            <Table columns={columns} data={data} />
        </div>
    );
};

export default TeamList;
