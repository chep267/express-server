/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** libs */
import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { ReasonPhrases } from 'http-status-codes';

/** constants */
import { AppApiPath } from '@module-global/constants/path';

/** app */
import app from '@src/index';

describe('Test API endpoints', () => {
    it('GET /feed - should return status 401', async () => {
        const res = await request(app).get(`${AppApiPath.root}/${AppApiPath.feed}`);
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', ReasonPhrases.UNAUTHORIZED);
    });
});
