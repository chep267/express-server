/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

import type { Request, Response } from 'express';

const feed = (_req: Request, res: Response) => {
    res.status(200).json({ message: 'feed', status: 200 });
};

const messenger = (_req: Request, res: Response) => {
    res.status(200).json({ message: 'messenger', status: 200 });
};

export const apiTest = {
    feed,
    messenger
};
