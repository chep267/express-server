/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

/** routes */
import { authRouter } from '@routes/auth.route';
import { testRouter } from '@routes/test.route';

export const rootRouter = Router();

rootRouter.get('/', (_req, res) => res.status(StatusCodes.OK).json(ReasonPhrases.OK));
rootRouter.get('/favicon.ico', (_req, res) => res.status(StatusCodes.NO_CONTENT).end());
rootRouter.use(authRouter);
rootRouter.use(testRouter);
rootRouter.use((_req, res) => res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND));
