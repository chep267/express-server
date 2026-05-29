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

/** models */
import { ThreadModel } from '@module-messenger/models';

/** types */
import type { NextFunction } from 'express';

const createThread = async (
    req: App.ModuleMessenger.Api.CreateThread['Request'],
    res: App.ModuleMessenger.Api.CreateThread['Response'],
    next: NextFunction
) => {
    try {
        const thread = await ThreadModel.createThread(req.body);
        return res.status(StatusCodes.OK).json(genResponse({ data: thread }));
    } catch (error) {
        next(error);
    }
};

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

const updateThread = async (
    req: App.ModuleMessenger.Api.UpdateThread['Request'],
    res: App.ModuleMessenger.Api.UpdateThread['Response'],
    next: NextFunction
) => {
    try {
        const thread = await ThreadModel.updateThread(req.body);
        return res.status(StatusCodes.OK).json(genResponse({ data: thread }));
    } catch (error) {
        next(error);
    }
};

export const threadController = {
    getThreads,
    createThread,
    updateThread
};
