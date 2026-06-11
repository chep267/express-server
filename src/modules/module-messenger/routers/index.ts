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
import { threadController } from '@module-messenger/controllers/thread';
import { messageController } from '@module-messenger/controllers/message';

const upload = multer();
const messengerRouter = Router();

/** threads */
messengerRouter.get(MessengerApiPath.threads, threadController.gets);
messengerRouter.post(MessengerApiPath.threads, upload.none(), threadController.create);
messengerRouter.patch(MessengerApiPath.threadRead, upload.none(), threadController.read);
messengerRouter.delete(MessengerApiPath.thread, threadController.remove);

/** messages */
messengerRouter.get(MessengerApiPath.messages, messageController.gets);
messengerRouter.post(MessengerApiPath.messages, upload.none(), messageController.create);
messengerRouter.delete(MessengerApiPath.message, messageController.remove);

export { messengerRouter };
