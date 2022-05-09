import SQL from 'sql-template-strings';
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import { displaySide } from '@speechanddebate/nsda-js-utils';
import { query } from '../../helpers/mysql';
import log from '../log/insertEventLog';

const postRound = {
    POST: async (req, res) => {
        const [team] = await query(SQL`
            SELECT C.archived, C.event
            FROM teams T
            INNER JOIN schools S ON S.school_id = T.school_id
            INNER JOIN caselists C ON C.caselist_id = S.caselist_id
            WHERE C.name = ${req.params.caselist}
            AND LOWER(S.name) = LOWER(${req.params.school})
            AND LOWER(T.name) = LOWER(${req.params.team})
        `);

        if (!team) { return res.status(400).json({ message: 'Team not found' }); }
        if (team.archived) { return res.status(401).json({ message: 'Caselist archived, no modifications allowed' }); }

        let filename;

        if (req.body.opensource && req.body.filename) {
            // Convert base64 encoded file back into a buffer for saving
            let arrayBuffer;
            try {
                arrayBuffer = Buffer.from(req.body.opensource, 'base64');
            } catch (err) {
                return res.status(400).json({ message: 'Invalid open source file' });
            }

            // Use the extension from the provided file, but disallow anything weird
            let extension = path.extname(req.body.filename);
            if (['.docx', '.doc', '.pdf', '.rtf', '.txt'].indexOf(extension) === -1) {
                extension = '';
            }
            filename = `${req.params.school} ${req.params.team} `;
            filename += `${displaySide(req.body.side, team.event)} `;
            filename += `${req.body.tourn.trim()} `;
            filename += parseInt(req.body.round) ? `Round ${req.body.round}` : req.body.round.trim();
            filename += `${extension}`;

            // TODO - decide on a file structure and whether to add a hash or something
            try {
                await fs.promises.mkdir(`${cwd()}/uploads/${req.params.caselist}/${req.params.school}/${req.params.team}`, { recursive: true });
                await fs.promises.writeFile(`${cwd()}/uploads/${req.params.caselist}/${req.params.school}/${req.params.team}/${filename}`, arrayBuffer);
            } catch (err) {
                return res.status(500).json({ message: 'Failed to upload open source file' });
            }
        }

        let round;
        try {
            round = await query(SQL`
                INSERT INTO rounds (team_id, side, tournament, round, opponent, judge, report, opensource, tourn_id, external_id, created_by_id, updated_by_id)
                    SELECT
                        T.team_id,
                        ${req.body.side.trim()},
                        ${req.body.tourn.trim()},
                        ${req.body.round.trim()},
                        ${req.body.opponent.trim()},
                        ${req.body.judge.trim()},
                        ${req.body.report.trim()},
                        ${filename || null},
                        ${req.body.tourn_id || null},
                        ${req.body.external_id || null},
                        ${req.user_id},
                        ${req.user_id}
                    FROM teams T
                    INNER JOIN schools S ON S.school_id = T.school_id
                    INNER JOIN caselists C ON C.caselist_id = S.caselist_id
                    WHERE C.name = ${req.params.caselist}
                    AND LOWER(S.name) = LOWER(${req.params.school})
                    AND LOWER(T.name) = LOWER(${req.params.team})
            `);
            await query(SQL`
                INSERT INTO rounds_history (
                    round_id,
                    version,
                    team_id,
                    side,
                    tournament,
                    round,
                    opponent,
                    judge,
                    report,
                    opensource,
                    tourn_id,
                    external_id,
                    created_at,
                    created_by_id,
                    updated_at,
                    updated_by_id,
                    event
                )
                    SELECT
                        R.round_id,
                        (SELECT COALESCE(MAX(version), 0) + 1 FROM rounds_history RH WHERE RH.round_id = R.round_id) AS 'version',
                        R.team_id,
                        R.side,
                        R.tournament,
                        R.round,
                        R.opponent,
                        R.judge,
                        R.report,
                        R.opensource,
                        R.tourn_id,
                        R.external_id,
                        R.created_at,
                        R.created_by_id,
                        R.updated_at,
                        R.updated_by_id,
                        'insert'
                    FROM rounds R
                    WHERE R.round_id = ${round.insertId}
            `);
        } catch (err) {
            return res.status(500).json({ message: 'Failed to create round' });
        }

        let cites = req.body.cites || [];
        cites = cites.filter(c => (
            c.title
            && c.cites
            && c.title.trim().length > 0
            && c.cites.trim().length > 0
        ));

        const promises = [];
        if (cites.length > 0) {
            cites.forEach(c => {
                promises.push(
                    query(SQL`
                        INSERT INTO cites (round_id, title, cites, created_by_id, updated_by_id)
                        VALUES (
                                ${round.insertId},
                                ${c.title.trim()},
                                ${c.cites.trim()},
                                ${req.user_id},
                                ${req.user_id}
                        )
                    `).then(newCite => {
                        return query(SQL`
                            INSERT INTO cites_history (cite_id, version, round_id, title, cites, created_at, created_by_id, updated_at, updated_by_id, event)
                            SELECT
                                CT.cite_id,
                                (SELECT COALESCE(MAX(version), 0) + 1 FROM cites_history CH WHERE CH.cite_id = CT.cite_id) AS 'version',
                                CT.round_id,
                                CT.title,
                                CT.cites,
                                CT.created_at,
                                CT.created_by_id,
                                CT.updated_at,
                                CT.updated_by_id,
                                'insert'
                            FROM cites CT
                            WHERE CT.cite_id = ${newCite.insertId}
                        `);
                    }),
                );
            });
        }
        try {
            await Promise.all(promises);
        } catch (err) {
            return res.status(500).json({ message: 'Failed to create cites' });
        }

        await log({
            user_id: req.user_id,
            tag: 'round-add',
            description: `Created round #${round.insertId} for ${req.params.school} ${req.params.team} in ${req.params.caselist}`,
            round_id: parseInt(round.insertId),
        });

        return res.status(201).json({ message: 'Round successfully created' });
    },
};

postRound.POST.apiDoc = {
    summary: 'Creates a round',
    operationId: 'postRound',
    parameters: [
        {
            in: 'path',
            name: 'caselist',
            description: 'Caselist',
            required: true,
            schema: { type: 'string' },
        },
        {
            in: 'path',
            name: 'school',
            description: 'School',
            required: true,
            schema: { type: 'string' },
        },
        {
            in: 'path',
            name: 'team',
            description: 'Team',
            required: true,
            schema: { type: 'string' },
        },
    ],
    requestBody: {
        description: 'The round to create',
        required: true,
        content: { '*/*': { schema: { $ref: '#/components/schemas/Round' } } },
    },
    responses: {
        201: {
            description: 'Created round',
            content: { '*/*': { schema: { $ref: '#/components/schemas/Round' } } },
        },
        default: { $ref: '#/components/responses/ErrorResponse' },
    },
    security: [{ cookie: [] }],
};

export default postRound;
