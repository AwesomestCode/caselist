import SQL from 'sql-template-strings';
import { query } from '../../helpers/mysql';

const getSchools = {
    GET: async (req, res) => {
        const sql = (SQL`
            SELECT S.* FROM schools S
            INNER JOIN caselists C ON S.caselist_id = C.caselist_id
            wHERE C.name = ${req.params.caselist}
            AND (S.deleted IS NULL OR S.deleted <> 1)
            ORDER BY S.display_name
        `);
        const schools = await query(sql);

        return res.status(200).json(schools);
    },
};

getSchools.GET.apiDoc = {
    summary: 'Returns list of schools in a caselist',
    operationId: 'getSchools',
    parameters: [
        {
            in: 'path',
            name: 'caselist',
            description: 'Which caselist to return schools in',
            required: true,
            schema: { type: 'string' },
        },
    ],
    responses: {
        200: {
            description: 'Schools',
            content: {
                '*/*': {
                    schema: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/School' },
                    },
                },
            },
        },
        default: { $ref: '#/components/responses/ErrorResponse' },
    },
};

export default getSchools;
