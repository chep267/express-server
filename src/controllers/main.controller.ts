/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes } from 'http-status-codes';

/** utils */
import { genResponse } from '@utils/genResponse';

/** controllers */
import { apiTicket } from '@controllers/dashboard.controller';

/** types */
import type { Request, Response } from 'express';

const feed = (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json(genResponse({ message: 'feed' }));
};

const messenger = (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json(genResponse({ message: 'messenger' }));
};

export const apiMain = {
    feed,
    messenger,
    ticket: apiTicket
};
