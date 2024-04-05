/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

import { Router } from 'express';

/** controllers */
import { apiAuth } from '@controller/auth.controller.ts';

/** constants */
import { PathAuthApi } from '@constant/PathAuthApi.js';

export const authRouter = Router();

authRouter.post(PathAuthApi.signin, apiAuth.signin);
authRouter.post(PathAuthApi.signout, apiAuth.signout);
authRouter.post(PathAuthApi.restart, apiAuth.restart);
authRouter.post(PathAuthApi.register, apiAuth.register);
authRouter.post(PathAuthApi.recover, apiAuth.recover);
