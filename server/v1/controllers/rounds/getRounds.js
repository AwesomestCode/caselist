import SQL from 'sql-template-strings';
import { query } from '../../helpers/mysql';

const getRounds = {
    GET: async (req, res) => {
        let sql = (SQL`
            SELECT R.* FROM rounds R 
            INNER JOIN teams T ON T.team_id = R.team_id
            INNER JOIN schools S ON S.school_id = T.school_id
            INNER JOIN caselists C ON S.caselist_id = C.caselist_id
            wHERE C.slug = ${req.params.caselist}
            AND S.name = ${req.params.school}
            AND T.code = ${req.params.team}
        `);
        if (req.params.side) {
            sql += SQL`AND R.side = ${req.params.side}`;
        }
        const rounds = await query(sql);

        return res.status(200).json(rounds);
    },
};

getRounds.GET.apiDoc = {
    summary: 'Returns list of rounds for a team',
    operationId: 'getRounds',
    parameters: [
        {
            in: 'path',
            name: 'caselist',
            description: 'Which caselist to return schools in',
            required: true,
            schema: { type: 'string' },
        },
        {
            in: 'path',
            name: 'school',
            description: 'Which school to return teams in',
            required: true,
            schema: { type: 'string' },
        },
        {
            in: 'path',
            name: 'team',
            description: 'Which team to return rounds in',
            required: true,
            schema: { type: 'string' },
        },
        {
            in: 'query',
            name: 'side',
            description: 'Which side to return rounds for',
            required: false,
            schema: { type: 'string' },
        },
    ],
    responses: {
        200: {
            description: 'Rounds',
            content: {
                '*/*': {
                    schema: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Round' },
                    },
                },
            },
        },
        default: { $ref: '#/components/responses/ErrorResponse' },
    },
};

export default getRounds;
