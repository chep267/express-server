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
import { MainApiPath } from '@constants/MainApiPath';

/** utils */
import { genResponse } from '@utils/genResponse';

/** routes */
import { authRouter } from '@routes/auth.route';
import { mainRouter } from '@routes/main.route';

const rootRouter = Router();

/** home */
rootRouter.get('/', (_req, res) => res.status(StatusCodes.OK).json(genResponse()));

/** favicon */
rootRouter.get(/\/favicon\..*$/, (_req, res) => res.status(StatusCodes.NO_CONTENT).end());

/** auth */
rootRouter.use(AuthApiPath.root, authRouter);

/** main */
rootRouter.use(MainApiPath.root, mainRouter);

/** not found */
rootRouter.use((_req, res) => res.status(StatusCodes.NOT_FOUND).json(genResponse({ message: ReasonPhrases.NOT_FOUND })));

export { rootRouter };
