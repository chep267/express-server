/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';
// import multer from 'multer';

/** constants */
import { UserApiPath } from '@module-user/constants/path';

/** controllers */
import { userController } from '@module-user/controllers';

// const upload = multer();
const userRouter = Router();

/** user */
userRouter.get(UserApiPath.user, userController.getUser);
userRouter.get(UserApiPath.users, userController.getUsers);

export { userRouter };
