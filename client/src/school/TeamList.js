import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { toast } from 'react-toastify';

import { deleteTeam } from '../helpers/api';
import { useStore } from '../helpers/store';
import { affName, negName } from '../helpers/common';
// import TabroomChaptersDropdown from './TabroomChaptersDropdown';
import Breadcrumbs from '../layout/Breadcrumbs';
import Table from '../tables/Table';
import Error from '../layout/Error';
import Loader from '../loader/Loader';
import AddTeam from './AddTeam';

import styles from './TeamList.module.css';

const TeamList = () => {
    const { caselist, school } = useParams();
    const { school: schoolData, caselist: caselistData, teams, fetchSchool, fetchTeams } = useStore();
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        setFetching(true);
        fetchSchool(caselist, school);
        fetchTeams(caselist, school);
        setFetching(false);
    }, [caselist, school, fetchSchool, fetchTeams]);

    const handleDelete = useCallback(async (e) => {
        // eslint-disable-next-line no-alert
        alert(`Deleting team ${e.currentTarget.dataset.name}`);
        try {
            await deleteTeam(caselist, school, e.currentTarget.dataset.name);
            toast.success('Team successfully deleted');
        } catch (err) {
            toast.error('Failed to delete team');
            console.log(err);
        }
    }, [caselist, school]);

    const data = useMemo(() => teams, [teams]);
    const columns = useMemo(() => [
        {
            Header: 'Team',
            width: 'auto',
            accessor: 'display_name',
            Cell: (row) => {
                return (
                    <>
                        <Link to={`/${caselist}/${school}/${row.row.original?.name}`}>
                            {row.row.original.display_name} (
                            <span>{row.row.original.debater1_first} </span>
                            <span>{row.row.original.debater1_last} </span>
                            <span>- </span>
                            <span>{row.row.original.debater2_first} </span>
                            <span>{row.row.original.debater2_last}</span>
                            )
                        </Link>
                        <div className={styles['hover-links']}>
                            <Link to={`/${caselist}/${school}/${row.row.original?.name}/Aff`}>{affName(caselistData.event)}</Link>
                            <Link to={`/${caselist}/${school}/${row.row.original?.name}/Neg`}>{negName(caselistData.event)}</Link>
                        </div>
                    </>
                );
            },
        },
        {
            id: 'delete',
            width: '25px',
            Header: '',
            disableSortBy: true,
            disableFilters: true,
            accessor: (row) => row,
            className: styles.center,
            Cell: (row) => (
                <FontAwesomeIcon
                    className={styles.trash}
                    icon={faTrash}
                    data-name={row.value?.name}
                    onClick={e => handleDelete(e)}
                />
            ),
        },
    ], [caselist, school, handleDelete, caselistData]);

    const timestamp = moment(schoolData?.updated_at, 'YYYY-MM-DD HH:mm:ss').format('l');

    if (fetching) { return <Loader />; }
    if (!fetching && schoolData.message) { return <Error is404 />; }

    return (
        <>
            <div className={styles.teamlist}>
                <Breadcrumbs />
                <h1 className={styles.schoolname}>{schoolData.display_name}</h1>
                {
                    schoolData.updatedBy &&
                    <p className={styles.timestamp}>
                        Last updated by {schoolData.updated_by} on {timestamp}
                    </p>
                }
                {/* <TabroomChaptersDropdown /> */}
                <Table columns={columns} data={data} className={styles['team-table']} noDataText="No teams found" loading={fetching} />
            </div>
            <hr />
            {!caselistData.archived && <AddTeam />}
        </>
    );
};

export default TeamList;
