/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';

/** constants */
import { AppApiPath } from '@modules/global/constants/path';

/** controllers */
import { authController } from '@modules/auth/controllers';
import { feedController } from '@modules/global/controllers/feed';
import { poemController } from '@modules/global/controllers/poem';

/** routers */
import { userRouter } from '@modules/user/routers';
import { messengerRouter } from '@modules/messenger/routers';

const appRouter = Router();

/** auth */
appRouter.use(authController.verify);

/** user */
appRouter.use(userRouter);

/** messenger */
appRouter.use(messengerRouter);

/** feed */
appRouter.get(AppApiPath.feeds, feedController.gets);

/** poem */
appRouter.get(AppApiPath.poems, poemController.gets);

export { appRouter };
