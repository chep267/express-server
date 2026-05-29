/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';
import multer from 'multer';

/** constants */
import { MessengerApiPath } from '@module-messenger/constants/path';

/** controllers */
import { messengerController } from '@module-messenger/controllers';

const upload = multer();
const messengerRouter = Router();

/** threads */
messengerRouter.get(MessengerApiPath.threads, messengerController.getThreads);
messengerRouter.post(MessengerApiPath.threads, upload.none(), messengerController.createThread);
messengerRouter.patch(MessengerApiPath.threads, upload.none(), messengerController.createThread);

/** messages */
messengerRouter.get(MessengerApiPath.messages, messengerController.getMessages);

export { messengerRouter };
