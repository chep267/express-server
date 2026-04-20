/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

/** constants */
import { AuthApiPath } from '@module-auth/constants/path';
import { AppApiPath } from '@module-global/constants/path';

/** utils */
import { genResponse } from '@module-base/utils/api';

/** routes */
import { authRouter } from '@module-auth/routers';
import { appRouter } from '@module-global/routers/app.route';

const rootRouter = Router();

/** home */
rootRouter.get('/', (_req, res) => res.status(StatusCodes.OK).json(genResponse()));

/** favicon */
rootRouter.get(/\/favicon\..*$/, (_req, res) => res.status(StatusCodes.NO_CONTENT).end());

/** auth */
rootRouter.use(AuthApiPath.root, authRouter);

/** main */
rootRouter.use(AppApiPath.root, appRouter);

/** not found */
rootRouter.use((_req, res) => res.status(StatusCodes.NOT_FOUND).json(genResponse({ message: ReasonPhrases.NOT_FOUND })));

export { rootRouter };
