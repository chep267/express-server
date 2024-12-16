/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';

/** constant */
import { AppEnv } from '../constants/AppEnv';

export const baseRouter = Router();

baseRouter.get('/', (_req, res) => {
    res.status(200).json(`chep-server start in port: ${AppEnv.appPort}`);
});

baseRouter.get('/dong', (_req, res) => {
    res.status(200).json(`hello dong`);
});
