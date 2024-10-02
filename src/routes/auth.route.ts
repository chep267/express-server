/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';

/** controllers */
import { apiAuth } from '@controller/auth.controller';

/** constants */
import { PathAuthApi } from '@constant/PathAuthApi';

export const authRouter = Router();

authRouter.post(PathAuthApi.signin, apiAuth.signin);
authRouter.post(PathAuthApi.signout, apiAuth.signout);
authRouter.post(PathAuthApi.restart, apiAuth.restart);
authRouter.post(PathAuthApi.register, apiAuth.register);
authRouter.post(PathAuthApi.recover, apiAuth.recover);
