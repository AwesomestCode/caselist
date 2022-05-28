import config from '../../../config';
import { debugLogger } from '../../helpers/logger';

const getTabroomStudents = {
    GET: async (req, res) => {
        let url = `${config.TABROOM_API_URL}`;
        url += `/caselist/students?person_id=${req.user_id}`;
        url += `&caselist_key=${config.TABROOM_CASELIST_KEY}`;

        let students = [];
        try {
            const response = await fetch(url);
            students = await response.json();
        } catch (err) {
            debugLogger.error('Failed to retrieve Tabroom students');
            students = [];
        }

        return res.status(200).json(students);
    },
};

getTabroomStudents.GET.apiDoc = {
    summary: 'Returns list of students linked to a user on Tabroom',
    operationId: 'getTabroomStudents',
    responses: {
        200: {
            description: 'Students',
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

export default getTabroomStudents;
