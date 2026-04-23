/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** libs */
import request from 'supertest';
import { describe, it, beforeAll, expect } from 'vitest';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

/** constants */
import { AuthApiPath } from '@module-auth/constants/path';
import { AppApiPath } from '@module-global/constants/path';

/** app */
import app from '@src/index';

describe('Test api feed --- not authorization', () => {
    it('GET /feed - should return status 401', async () => {
        const res = await request(app).get(`${AppApiPath.root}${AppApiPath.feed}`);
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', ReasonPhrases.UNAUTHORIZED);
    });
});

describe('Test api feed --- has authorization', () => {
    let token: string;

    beforeAll(async () => {
        const res = await request(app).post(`${AuthApiPath.root}${AuthApiPath.signin}`).send({
            email: 'dong.nguyenthanh@powergatesoftware.com',
            password: 'Midom@2024'
        });
        expect(res.status).toBe(StatusCodes.OK);
        token = res.body.data.token.value;
    });

    it('GET /feed - should return status 200 when authenticated', async () => {
        const res = await request(app).get(`${AppApiPath.root}${AppApiPath.feed}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('message', 'feed');
    });
});
