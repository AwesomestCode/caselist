import { assert } from 'chai';
import request from 'supertest';
import testFixtures from '../../../tests/testFixtures';
import testTeardown from '../../../tests/testTeardown';
import server from '../../../index';

describe('GET /v1/caselists/{caselist}', () => {
    beforeEach(async () => {
        await testFixtures();
    });

    it('should return caselist data', async () => {
        const res = await request(server)
            .get(`/v1/caselists/testcaselist`)
            .set('Accept', 'application/json')
            .set('Cookie', ['caselist_token=test'])
            .expect('Content-Type', /json/)
            .expect(200);

        assert.isObject(res.body, 'Response is an object');
        assert.property(res.body, 'caselist_id', 'caselist_id property');
        assert.property(res.body, 'name', 'name property');
        assert.property(res.body, 'display_name', 'display_name property');
        assert.property(res.body, 'year', 'year property');
        assert.property(res.body, 'event', 'event property');
        assert.property(res.body, 'level', 'level property');
        assert.property(res.body, 'team_size', 'team_size property');
        assert.property(res.body, 'archived', 'archived property');
    });

    // it('should error on invalid parameters', async () => {
    //     const base64 = Buffer.from(`1:test`).toString('base64');
    //     let res = await request(server)
    //         .get('/v2/ballots/invalid')
    //         .set('Accept', 'application/json')
    //         .set('Authorization', `Basic ${base64}`)
    //         .expect('Content-Type', /json/)
    //         .expect(400);
    //     assert.strictEqual(res.body.message, 'Validation error', 'Correct message');

    //     res = await request(server)
    //         .get(`/v2/ballots/${ballotId}/?school_id=invalid`)
    //         .set('Accept', 'application/json')
    //         .set('Authorization', `Basic ${base64}`)
    //         .expect('Content-Type', /json/)
    //         .expect(400);
    //     assert.strictEqual(res.body.message, 'Validation error', 'Correct message');
    // });

    // it('should return a 401 with no authorization header', async () => {
    //     await request(server)
    //         .get('/v2/ballots/1')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /json/)
    //         .expect(401);
    // });

    afterEach(async () => {
        await testTeardown();
    });
});
