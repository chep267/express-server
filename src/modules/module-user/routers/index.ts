/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';

/** constants */
import { UserApiPath } from '@module-user/constants/path';

/** controllers */
import { userController } from '@module-user/controllers';

const userRouter = Router();

userRouter.get(UserApiPath.user, userController.get);
userRouter.get(UserApiPath.users, userController.gets);

export { userRouter };
