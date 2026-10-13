/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';

/** constants */
import { AppApiPath } from '@module-global/constants/path';

/** controllers */
import { authController } from '@module-auth/controllers';
import { feedController } from '@module-global/controllers/feed';
import { poemController } from '@module-global/controllers/poem';

/** routers */
import { userRouter } from '@module-user/routers';
import { messengerRouter } from '@module-messenger/routers';

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
