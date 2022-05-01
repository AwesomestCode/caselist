import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faAngleDown, faAngleUp, faCopy } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import { loadCites, deleteCite } from '../helpers/api';
import Table from '../tables/Table';
import ConfirmButton from '../helpers/ConfirmButton';
import { useDeviceDetect } from '../helpers/common';
import './TeamRounds.css';

const CitesTable = ({ loading }) => {
    const { caselist, school, team, side } = useParams();

    const [cites, setCites] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await loadCites(caselist, school, team);
                setCites(side ? response.filter(r => r.side === side) : response);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [caselist, school, team, side]);

    const handleDeleteCite = useCallback(async (id) => {
        try {
            const response = await deleteCite(caselist, school, team, id);
            toast.success(response.message);
        } catch (err) {
            console.log(err);
        }
    }, [caselist, school, team]);

    const handleDeleteCiteConfirm = useCallback((id) => {
        toast(<ConfirmButton
            message="Are you sure you want to delete this cite entry?"
            handler={() => handleDeleteCite(id)}
        />);
    }, [handleDeleteCite]);

    const handleToggleCites = useCallback((e) => {
        const newCites = [...cites];
        newCites.forEach(c => {
            if (c.cite_id === parseInt(e.currentTarget.id)) {
                c.citesopen = !c.citesopen;
            }
        });
        setCites(newCites);
    }, [cites]);

    const handleCopyCites = useCallback((id) => {
        const cite = cites.find(c => c.cite_id === parseInt(id));
        toast.success(cite);
    }, [cites]);

    const citeHeaders = useMemo(() => {
        return [
            {
                id: 'cites',
                Header: 'Cites',
                accessor: row => row,
                className: 'cites',
                Cell: (row) => {
                    return (
                        <div className="cites">
                            <h1
                                onClick={e => handleToggleCites(e)}
                                id={row.row?.original?.cite_id}
                            >
                                <span>{row.value?.title}</span>
                                <span className="caret">
                                    <FontAwesomeIcon
                                        icon={
                                            row.row?.original?.citesopen
                                            ? faAngleDown
                                            : faAngleUp
                                        }
                                    />
                                </span>
                            </h1>
                            <span
                                className={row.row?.original?.citesopen ? 'cites citesopen' : 'cites citesclosed'}
                            >
                                <Markdown>{row.value?.cites}</Markdown>
                            </span>
                        </div>
                    );
                },
            },
            {
                id: 'copy',
                Header: '',
                disableSortBy: true,
                accessor: (row) => row,
                className: 'center',
                Cell: (row) => (
                    <span
                        id={row.row?.original?.cite_id}
                        onClick={() => handleCopyCites(row.row?.original?.cite_id)}
                        className="copy"
                    >
                        <FontAwesomeIcon
                            icon={faCopy}
                        />
                    </span>
                ),
            },
            {
                id: 'delete',
                Header: '',
                disableSortBy: true,
                accessor: (row) => row,
                className: 'center',
                Cell: (row) => (
                    <span
                        id={row.row?.original?.cite_id}
                        onClick={() => handleDeleteCiteConfirm(row.row?.original?.cite_id)}
                        className="trash"
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                        />
                    </span>
                ),
            },
        ];
    }, [handleToggleCites, handleCopyCites, handleDeleteCiteConfirm]);

    const { isMobile } = useDeviceDetect();

    return (
        <Table columns={citeHeaders} data={cites} className={isMobile ? 'cites-table mobile-table' : 'cites-table'} noDataText="No cites found!" loading={loading} />
    );
};

export default CitesTable;
