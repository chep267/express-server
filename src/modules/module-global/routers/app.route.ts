/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';
import multer from 'multer';

/** constants */
import { AppApiPath } from '@module-global/constants/path';

/** controllers */
import { authController } from '@module-auth/controllers';
import { appController } from '@module-global/controllers';

const upload = multer();
const appRouter = Router();

/** auth */
appRouter.use(authController.verify);

/** another */
appRouter.get(AppApiPath.feed, appController.feed);
appRouter.get(AppApiPath.messenger, appController.messenger);

/** ticket */
appRouter.get(AppApiPath.ticket, appController.ticket.get);
appRouter.get(AppApiPath.tickets, appController.ticket.getAll);
appRouter.post(AppApiPath.ticket, upload.none(), appController.ticket.post);
appRouter.put(AppApiPath.ticket, upload.none(), appController.ticket.put);
appRouter.patch(AppApiPath.ticket, upload.none(), appController.ticket.patch);
appRouter.delete(AppApiPath.ticket, upload.none(), appController.ticket.delete);

/** ticket status */
appRouter.get(AppApiPath.ticketStatus, appController.ticket.getStatus);

export { appRouter };
