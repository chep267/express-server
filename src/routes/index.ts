/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

/** constants */
import { AuthApiPath } from '@constants/AuthApiPath';

/** routes */
import { authRouter } from '@routes/auth.route';
import { testRouter } from '@routes/test.route';

export const rootRouter = Router();

/** home */
rootRouter.get('/', (_req, res) => res.status(StatusCodes.OK).json(ReasonPhrases.OK));

/** favicon */
rootRouter.get('/favicon.ico', (_req, res) => res.status(StatusCodes.NO_CONTENT).end());

/** auth */
rootRouter.use(AuthApiPath.root, authRouter);

/** test */
rootRouter.use('/test', testRouter);

/** not found */
rootRouter.use((_req, res) => res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND));
