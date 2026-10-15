/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes } from 'http-status-codes';

/** constants */
import { MessengerSocketEvent } from '@modules/messenger/constants/key';

/** utils */
import { pusherServer } from '@modules/base/utils/pusher';
import { genId } from '@modules/base/utils/gen';
import { genResponse } from '@modules/base/utils/api';
import { getAccessToken, getUidFromToken } from '@modules/auth/utils/token';

/** models */
import { ThreadModel } from '@modules/messenger/models/thread';

/** types */
import type { NextFunction } from 'express';

const get = async (
    req: App.ModuleMessenger.Api.ThreadControllerAction['Get']['Request'],
    res: App.ModuleMessenger.Api.ThreadControllerAction['Get']['Response'],
    next: NextFunction
) => {
    try {
        const thread = await ThreadModel.get(req.params);
        return res.status(StatusCodes.OK).json(genResponse({ data: thread }));
    } catch (error) {
        next(error);
    }
};

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
        thread?.uids.forEach((uid) => {
            pusherServer.trigger(uid, MessengerSocketEvent.THREAD_CREATED, thread);
        });
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
        thread?.uids.forEach((uid) => {
            pusherServer.trigger(uid, MessengerSocketEvent.THREAD_REMOVED, thread);
        });
        return res.status(StatusCodes.OK).json(genResponse({ data: Boolean(thread) }));
    } catch (error) {
        next(error);
    }
};

export const threadController = {
    get,
    gets,
    create,
    read,
    remove
};
