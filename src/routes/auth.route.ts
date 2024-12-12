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
import { AuthApiPath } from '@constant/AuthApiPath';

export const authRouter = Router();

authRouter.post(AuthApiPath.signin, (req, res, next) => {
    apiAuth.signin(req, res, next).then();
});
authRouter.post(AuthApiPath.signout, (req, res) => {
    apiAuth.signout(req, res).then();
});
authRouter.post(AuthApiPath.restart, (req, res, next) => {
    apiAuth.restart(req, res, next).then();
});
authRouter.post(AuthApiPath.register, (req, res, next) => {
    apiAuth.register(req, res, next).then();
});
authRouter.post(AuthApiPath.recover, (req, res, next) => {
    apiAuth.recover(req, res, next).then();
});
