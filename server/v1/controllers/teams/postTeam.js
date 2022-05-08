import SQL from 'sql-template-strings';
import { query } from '../../helpers/mysql';
import log from '../log/insertEventLog';

const postTeam = {
    POST: async (req, res) => {
        const name = `${req.body.debater1_last.slice(0, 2)}${req.body.debater2_last.slice(0, 2)}`;
        const displayName = `${req.params.school} ${req.body.debater1_last.slice(0, 2)}${req.body.debater2_last.slice(0, 2)}`;

        const team = await (query(SQL`
                SELECT T.*
                FROM teams T
                INNER JOIN schools S ON S.school_id = T.school_id
                INNER JOIN caselists C ON S.caselist_id = C.caselist_id
                WHERE C.name = ${req.params.caselist}
                AND LOWER(S.name) = LOWER(${req.params.school})
                AND LOWER(T.name) = LOWER(${name})
        `));
        if (team && team.length > 0) {
            return res.status(400).json({ message: 'Team already exists' });
        }

        const [result] = await query(SQL`
            SELECT C.archived
            FROM schools S ON S.school_id = T.school_id
            INNER JOIN caselists C ON C.caselist_id = S.caselist_id
            WHERE C.name = ${req.params.caselist}
            AND LOWER(S.name) = LOWER(${req.params.school})
        `);

        if (!result) { return res.status(400).json({ message: 'School not found' }); }
        if (result.archived) { return res.status(401).json({ message: 'Caselist archived, no modifications allowed' }); }

        const [newTeam] = await query(SQL`
            INSERT INTO teams
                (school_id, name, display_name, debater1_first, debater1_last, debater2_first, debater2_last, created_by_id)
                SELECT
                    S.school_id,
                    ${name},
                    ${displayName},
                    ${req.body.debater1_first?.trim() || null},
                    ${req.body.debater1_last?.trim() || null},
                    ${req.body.debater2_first?.trim() || null},
                    ${req.body.debater2_last?.trim() || null},
                    ${req.user_id}
                FROM schools S
                INNER JOIN caselists C ON S.caselist_id = C.caselist_id
                WHERE C.slug = ${req.params.caselist}
                AND LOWER(S.name) = LOWER(${req.params.school})
        `);

        await log({
            user_id: req.user_id,
            tag: 'team-add',
            description: `Added team #${newTeam.insertId} to ${req.params.school} in ${req.params.caselist}`,
            team_id: newTeam.insertId,
        });

        return res.status(201).json({ message: 'Team successfully created' });
    },
};

postTeam.POST.apiDoc = {
    summary: 'Creates a team',
    operationId: 'postTeam',
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
    ],
    requestBody: {
        description: 'The team to create',
        required: true,
        content: { '*/*': { schema: { $ref: '#/components/schemas/Team' } } },
    },
    responses: {
        201: {
            description: 'Created team',
            content: { '*/*': { schema: { $ref: '#/components/schemas/Team' } } },
        },
        default: { $ref: '#/components/responses/ErrorResponse' },
    },
    security: [{ cookie: [] }],
};

export default postTeam;
