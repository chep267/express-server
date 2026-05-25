/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';
// import multer from 'multer';

/** constants */
import { MessengerApiPath } from '@module-messenger/constants/path';

/** controllers */
import { messengerController } from '@module-messenger/controllers';

// const upload = multer();
const messengerRouter = Router();

/** thread */
messengerRouter.get(MessengerApiPath.threads, messengerController.getThreads);
messengerRouter.get(MessengerApiPath.messages, messengerController.getMessages);

export { messengerRouter };
