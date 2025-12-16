/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';
import multer from 'multer';

/** controllers */
import { apiAuth } from '@controllers/auth.controller';

/** constants */
import { AuthApiPath } from '@constants/AuthApiPath';

const upload = multer();

export const authRouter = Router();

authRouter.post(AuthApiPath.signin, upload.none(), apiAuth.signin);
authRouter.post(AuthApiPath.signout, upload.none(), apiAuth.signout);
authRouter.post(AuthApiPath.restart, upload.none(), apiAuth.restart);
authRouter.post(AuthApiPath.register, upload.none(), apiAuth.register);
authRouter.post(AuthApiPath.recover, upload.none(), apiAuth.recover);
