import SQL from 'sql-template-strings';
import { query } from '../../helpers/mysql';

const putRound = {
    PUT: async (req, res) => {
        const [result] = await query(SQL`
            SELECT C.archived
            FROM rounds R
            INNER JOIN teams T ON T.team_id = R.team_id
            INNER JOIN schools S ON S.school_id = T.school_id
            INNER JOIN caselists C ON C.caselist_id = S.caselist_id
            WHERE C.name = ${req.params.caselist}
            AND LOWER(S.name) = LOWER(${req.params.school})
            AND LOWER(T.name) = LOWER(${req.params.team})
            AND R.round_id = ${req.params.round}
        `);

        if (!result) { return res.status(400).json({ message: 'Caselist, school, or team not found' }); }
        if (result.archived) { return res.status(401).json({ message: 'Caselist archived, no modifications allowed' }); }

        await query(SQL`
            UPDATE cites CT 
            INNER JOIN rounds R ON R.round_id = C.round_id
            INNER JOIN teams T ON T.team_id = R.team_id
            INNER JOIN schools S ON S.school_id = T.school_id
            INNER JOIN caselists C ON C.caselist_id = S.caselist_id
            SET CT.deleted = 1, CT.updated_by_id = ${req.user_id}
            WHERE C.name = ${req.params.caselist}
            AND LOWER(S.name) = LOWER(${req.params.school})
            AND LOWER(T.name) = LOWER(${req.params.team})
            AND CT.round_id = ${req.params.round}
        `);

        await query(SQL`
            UPDATE rounds R
            INNER JOIN teams T ON T.team_id = R.team_id
            INNER JOIN schools S ON S.school_id = T.school_id
            INNER JOIN caselists C ON C.caselist_id = S.caselist_id
            SET R.updated_at = CURRENT_TIMESTAMP, R.updated_by_id = ${req.user_id}
            WHERE C.name = ${req.params.caselist}
            AND LOWER(S.name) = LOWER(${req.params.school})
            AND LOWER(T.name = LOWER(${req.params.team})
            AND R.round_id = ${req.params.round}
        `);

        await query(SQL`
            INSERT INTO cites (round_id, cites, created_by_id)
            VALUES (${req.params.round}, ${JSON.stringify(req.body.cites)}, ${req.user_id})
        `);

        return res.status(201).json({ message: 'Round successfully updated' });
    },
};

putRound.PUT.apiDoc = {
    summary: 'Updates a round',
    operationId: 'putRound',
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
        {
            in: 'path',
            name: 'round',
            description: 'Round',
            required: true,
            schema: { type: 'integer' },
        },
    ],
    requestBody: {
        description: 'The round to update',
        required: true,
        content: { '*/*': { schema: { $ref: '#/components/schemas/Round' } } },
    },
    responses: {
        201: {
            description: 'Updated round',
            content: { '*/*': { schema: { $ref: '#/components/schemas/Round' } } },
        },
        default: { $ref: '#/components/responses/ErrorResponse' },
    },
    security: [{ cookie: [] }],
};

export default putRound;
