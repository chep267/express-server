/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes } from 'http-status-codes';

/** utils */
import { genId } from '@module-base/utils/gen';
import { genResponse } from '@module-base/utils/api';
import { getAccessToken, getUidFromToken } from '@module-auth/utils/token';

/** models */
import { ThreadModel } from '@module-messenger/models/thread';

/** socket */
import { io } from '@module-base/utils/socket';

/** types */
import type { NextFunction } from 'express';

const gets = async (
    req: App.ModuleMessenger.Api.ThreadControllerAction['Gets']['Request'],
    res: App.ModuleMessenger.Api.ThreadControllerAction['Gets']['Response'],
    next: NextFunction
) => {
    try {
        const accessToken = getAccessToken(req);
        const uid = getUidFromToken(accessToken) ?? '';
        const { data, metadata } = await ThreadModel.gets({ ...req.query, uid });
        return res.status(StatusCodes.OK).json(genResponse({ data, metadata }));
    } catch (error) {
        next(error);
    }
};

const create = async (
    req: App.ModuleMessenger.Api.ThreadControllerAction['Create']['Request'],
    res: App.ModuleMessenger.Api.ThreadControllerAction['Create']['Response'],
    next: NextFunction
) => {
    try {
        const { data } = req.body;
        const tid = genId('tid');
        const thread = await ThreadModel.create({ data: { ...data, id: tid } });
        return res.status(StatusCodes.CREATED).json(genResponse({ data: thread }));
    } catch (error) {
        next(error);
    }
};

const read = async (
    req: App.ModuleMessenger.Api.ThreadControllerAction['Read']['Request'],
    res: App.ModuleMessenger.Api.ThreadControllerAction['Read']['Response'],
    next: NextFunction
) => {
    const { tid } = req.params;
    const accessToken = getAccessToken(req);
    const uid = getUidFromToken(accessToken) ?? '';
    try {
        const thread = await ThreadModel.read({ tid, uid });
        return res.status(StatusCodes.OK).json(genResponse({ data: thread }));
    } catch (error) {
        next(error);
    }
};

const remove = async (
    req: App.ModuleMessenger.Api.ThreadControllerAction['Remove']['Request'],
    res: App.ModuleMessenger.Api.ThreadControllerAction['Remove']['Response'],
    next: NextFunction
) => {
    const { tid } = req.params;
    try {
        const thread = await ThreadModel.remove({ tid });
        if (thread) {
            thread.uids.forEach((id) => {
                io?.to(id).emit('THREAD_REMOVED', { id: thread.id });
            });
        }
        return res.status(StatusCodes.OK).json(genResponse({ data: Boolean(thread) }));
    } catch (error) {
        next(error);
    }
};

export const threadController = {
    gets,
    create,
    read,
    remove
};
