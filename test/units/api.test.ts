/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** libs */
import request from 'supertest';
import { describe, it, beforeAll, expect } from 'vitest';
import { StatusCodes } from 'http-status-codes';

/** constants */
import { AuthApiPath } from '@module-auth/constants/path';
import { AppApiPath } from '@module-global/constants/path';

/** app */
import app from '@src/index';

const REAL_ACCOUNT = {
    email: 'dong.nguyenthanh@powergatesoftware.com',
    password: 'Midom@2024'
};

describe('Test api', () => {
    let token: string;

    beforeAll(async () => {
        const res = await request(app).post(`${AuthApiPath.root}${AuthApiPath.signin}`).send(REAL_ACCOUNT);
        expect(res.status).toBe(StatusCodes.OK);
        token = res.body.metadata.token.value;
    });

    it('GET /poems', async () => {
        const res = await request(app)
            .get(`${AppApiPath.root}${AppApiPath.poems}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
