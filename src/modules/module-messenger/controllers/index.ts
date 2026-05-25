/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes } from 'http-status-codes';

/** utils */
import { genResponse } from '@module-base/utils/api';
import { MessageModel, ThreadModel } from '@module-messenger/models';

/** types */
import type { NextFunction } from 'express';

const getThreads = async (
    req: App.ModuleMessenger.Api.GetThreads['Request'],
    res: App.ModuleMessenger.Api.GetThreads['Response'],
    next: NextFunction
) => {
    try {
        const { items, ...metadata } = await ThreadModel.getThreads(req.query);
        res.status(StatusCodes.OK).json(genResponse({ data: items, metadata }));
    } catch (error) {
        next(error);
    }
};

const getMessages = async (
    req: App.ModuleMessenger.Api.GetMessages['Request'],
    res: App.ModuleMessenger.Api.GetMessages['Response'],
    next: NextFunction
) => {
    const { tid } = req.params;

    if (!tid) {
        return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Thread id is required!' }));
    }

    try {
        const { items, ...metadata } = await MessageModel.getMessages({ tid, ...req.query });
        res.status(StatusCodes.OK).json(genResponse({ data: items, metadata }));
    } catch (error) {
        next(error);
    }
};

export const messengerController = {
    getThreads,
    getMessages
};
