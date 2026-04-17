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
import { apiMain } from '@controllers/main.controller';
import { MainApiPath } from '@constants/MainApiPath';

const upload = multer();
const mainRouter = Router();

mainRouter.use(apiAuth.verify);
mainRouter.get(MainApiPath.feed, apiMain.feed);
mainRouter.get(MainApiPath.messenger, apiMain.messenger);
mainRouter.get(MainApiPath.ticket, apiMain.ticket.get);
mainRouter.get(MainApiPath.tickets, apiMain.ticket.getAll);
mainRouter.post(MainApiPath.ticket, upload.none(), apiMain.ticket.post);
mainRouter.put(MainApiPath.ticket, upload.none(), apiMain.ticket.put);
mainRouter.patch(MainApiPath.ticket, upload.none(), apiMain.ticket.patch);
mainRouter.delete(MainApiPath.ticket, upload.none(), apiMain.ticket.delete);

export { mainRouter };
