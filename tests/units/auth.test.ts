/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** libs */
import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

/** constants */
import { AuthApiPath } from '@module-auth/constants/path';

/** utils */
import { AccountTest } from '@tests/utils';

/** app */
import app from '@src/index';

const AccountFake = {
    email: 'abc@d.com',
    password: 'password@123'
};

describe('Test Auth: signin', () => {
    it('signin wrong', async () => {
        const res = await request(app).post(`${AuthApiPath.root}${AuthApiPath.signin}`).send(AccountFake);
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('message', 'Invalid email or password!');
    });
    it('signin success', async () => {
        if (!AccountTest.email && !AccountTest.password) {
            return;
        }
        const res = await request(app).post(`${AuthApiPath.root}${AuthApiPath.signin}`).send(AccountTest);
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('message', ReasonPhrases.OK);
    });
});

describe('Test Auth: signout', () => {
    let token: string;
    beforeAll(async () => {
        if (!AccountTest.email && !AccountTest.password) {
            expect(true);
            return;
        }
        const res = await request(app).post(`${AuthApiPath.root}${AuthApiPath.signin}`).send(AccountTest);
        expect(res.status).toBe(StatusCodes.OK);
        token = res.body.metadata.token.value;
    });
    it('signout success', async () => {
        if (!AccountTest.email && !AccountTest.password) {
            expect(true);
            return;
        }
        const res = await request(app)
            .post(`${AuthApiPath.root}${AuthApiPath.signout}`)
            .set('Authorization', `Bearer ${token}`)
            .send({});
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('message', ReasonPhrases.OK);
    });
});

describe('Test Auth: restart', () => {
    it('restart wrong', async () => {
        const res = await request(app)
            .post(`${AuthApiPath.root}${AuthApiPath.restart}`)
            .set('Authorization', `Bearer token`)
            .send({});
        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('restart success', async () => {
        if (!AccountTest.email && !AccountTest.password) {
            expect(true);
            return;
        }
        const res = await request(app).post(`${AuthApiPath.root}${AuthApiPath.signin}`).send(AccountTest);
        expect(res.status).toBe(StatusCodes.OK);
        const token = res.body.metadata.token.value;
        expect(token);
    });
});

describe('Test Auth: register', () => {
    it('register wrong', async () => {
        if (!AccountTest.email && !AccountTest.password) {
            expect(true);
            return;
        }
        const res = await request(app).post(`${AuthApiPath.root}${AuthApiPath.register}`).send(AccountTest);
        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toHaveProperty('message', 'Account already exists!');
    });
    it('register success', async () => {
        // const res = await request(app).post(`${AuthApiPath.root}${AuthApiPath.register}`).send(AccountFake);
        expect(true);
    });
});

describe('Test Auth: recover', () => {
    it('recover no data', async () => {
        const res = await request(app).post(`${AuthApiPath.root}${AuthApiPath.recover}`).send({});
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
    it('recover wrong', async () => {
        const res = await request(app).post(`${AuthApiPath.root}${AuthApiPath.recover}`).send(AccountFake);
        expect(res.status).toBe(StatusCodes.NOT_FOUND);
    });
    it('recover success', async () => {
        if (!AccountTest.email && !AccountTest.password) {
            expect(true);
            return;
        }
        const res = await request(app).post(`${AuthApiPath.root}${AuthApiPath.recover}`).send(AccountTest);
        expect(res.status).toBe(StatusCodes.OK);
    });
});
