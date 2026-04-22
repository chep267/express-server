/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes } from 'http-status-codes';

/** utils */
import { genResponse } from '@module-base/utils/api';

/** controllers */
import { ticketController } from '@module-global/controllers/ticket.controller';
import { poemController } from '@module-global/controllers/poem.controller';

/** types */
import type { Request, Response } from 'express';

const feed = (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json(genResponse({ message: 'feed' }));
};

const messenger = (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json(genResponse({ message: 'messenger' }));
};

export const appController = {
    feed,
    messenger,
    ticket: ticketController,
    poem: poemController
};
