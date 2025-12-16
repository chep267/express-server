/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes } from 'http-status-codes';

/** types */
import type { Request, Response } from 'express';

const feed = (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ message: 'feed', status: 200 });
};

const messenger = (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ message: 'messenger', status: 200 });
};

export const apiTest = {
    feed,
    messenger
};
