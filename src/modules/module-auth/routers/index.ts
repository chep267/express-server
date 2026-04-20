/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';
import multer from 'multer';

/** controllers */
import { authController } from '@module-auth/controllers';

/** constants */
import { AuthApiPath } from '@module-auth/constants/path';

const upload = multer();
const authRouter = Router();

authRouter.post(AuthApiPath.signin, upload.none(), authController.signin);
authRouter.post(AuthApiPath.signout, upload.none(), authController.signout);
authRouter.post(AuthApiPath.restart, upload.none(), authController.restart);
authRouter.post(AuthApiPath.register, upload.none(), authController.register);
authRouter.post(AuthApiPath.recover, upload.none(), authController.recover);

export { authRouter };
