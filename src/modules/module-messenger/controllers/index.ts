/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes } from 'http-status-codes';

/** utils */
import { genResponse } from '@module-base/utils/api';
import { getAccessToken, getUidFromToken } from '@module-auth/utils/token';
import { MessageModel, ThreadModel } from '@module-messenger/models';

/** types */
import type { NextFunction } from 'express';

const getThreads = async (
    req: App.ModuleMessenger.Api.GetThreads['Request'],
    res: App.ModuleMessenger.Api.GetThreads['Response'],
    next: NextFunction
) => {
    try {
        const accessToken = getAccessToken(req);
        const uid = getUidFromToken(accessToken);
        const { items, ...metadata } = await ThreadModel.getThreads({ ...req.query, uid });
        return res.status(StatusCodes.OK).json(genResponse({ data: items, metadata }));
    } catch (error) {
        next(error);
    }
};

const getMessages = async (
    req: App.ModuleMessenger.Api.GetMessages['Request'],
    res: App.ModuleMessenger.Api.GetMessages['Response'],
    next: NextFunction
) => {
    try {
        const { tid } = req.params;
        const { items, ...metadata } = await MessageModel.getMessages({ ...req.query, tid });
        return res.status(StatusCodes.OK).json(genResponse({ data: items, metadata }));
    } catch (error) {
        next(error);
    }
};

export const messengerController = {
    getThreads,
    getMessages
};
