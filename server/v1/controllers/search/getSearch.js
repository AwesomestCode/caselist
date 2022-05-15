import fetch from 'isomorphic-fetch';

const getSearch = {
    GET: async (req, res) => {
        try {
            // TODO - clean URL param
            const response = await fetch(
                `http://localhost:8983/solr/caselist/select?df=content&fl=id%2C%20content&indent=true&q.op=OR&q=${req.query.q.trim()}&rows=10&start=0`,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );
            const json = await response.json();
            return res.status(200).json(json);
        } catch (err) {
            console.log(err);
        }
    },
};

getSearch.GET.apiDoc = {
    summary: 'Returns search results',
    operationId: 'getSearch',
    parameters: [
        {
            in: 'query',
            name: 'q',
            description: 'Search query',
            required: true,
            schema: { type: 'string' },
        },
    ],
    responses: {
        200: {
            description: 'Search result',
            content: { '*/*': { schema: { $ref: '#/components/schemas/SearchResult' } } },
        },
        default: { $ref: '#/components/responses/ErrorResponse' },
    },
};

export default getSearch;
