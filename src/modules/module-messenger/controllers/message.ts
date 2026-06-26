/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes } from 'http-status-codes';

/** constants */
import { MessengerSocketEvent } from '@module-messenger/constants/key';

/** utils */
import { genId } from '@module-base/utils/gen';
import { genResponse } from '@module-base/utils/api';
import { pusherServer } from '@module-base/utils/pusher';

/** models */
import { ThreadModel } from '@module-messenger/models/thread';
import { MessageModel } from '@module-messenger/models/message';

/** types */
import type { NextFunction } from 'express';

const get = async (
    req: App.ModuleMessenger.Api.MessageControllerAction['Get']['Request'],
    res: App.ModuleMessenger.Api.MessageControllerAction['Get']['Response'],
    next: NextFunction
) => {
    try {
        const thread = await MessageModel.get(req.params);
        return res.status(StatusCodes.OK).json(genResponse({ data: thread }));
    } catch (error) {
        next(error);
    }
};

const gets = async (
    req: App.ModuleMessenger.Api.MessageControllerAction['Gets']['Request'],
    res: App.ModuleMessenger.Api.MessageControllerAction['Gets']['Response'],
    next: NextFunction
) => {
    try {
        const { tid } = req.params;
        const { data, metadata } = await MessageModel.gets({ ...req.query, tid });
        return res.status(StatusCodes.OK).json(genResponse({ data, metadata }));
    } catch (error) {
        next(error);
    }
};

const create = async (
    req: App.ModuleMessenger.Api.MessageControllerAction['Create']['Request'],
    res: App.ModuleMessenger.Api.MessageControllerAction['Create']['Response'],
    next: NextFunction
) => {
    try {
        const { data } = req.body;
        const mid = genId('mid');
        const [message, thread] = await Promise.all([
            MessageModel.create({ data: { ...data, id: mid } }),
            ThreadModel.addMessage({ tid: data.tid, uid: data.uid, mid })
        ]);

        thread?.uids.forEach((uid) => {
            pusherServer.trigger(uid, MessengerSocketEvent.MESSAGE_CREATED, message);
        });
        return res.status(StatusCodes.CREATED).json(genResponse({ data: message }));
    } catch (error) {
        next(error);
    }
};

const remove = async (
    req: App.ModuleMessenger.Api.MessageControllerAction['Remove']['Request'],
    res: App.ModuleMessenger.Api.MessageControllerAction['Remove']['Response'],
    next: NextFunction
) => {
    const { mid } = req.params;
    try {
        const message = await MessageModel.remove({ mid });
        if (message) {
            const thread = await ThreadModel.get({ tid: message.tid });
            thread?.uids.forEach((uid) => {
                pusherServer.trigger(uid, MessengerSocketEvent.MESSAGE_REMOVED, message);
            });
        }

        return res.status(StatusCodes.OK).json(genResponse({ data: true }));
    } catch (error) {
        next(error);
    }
};

export const messageController = {
    get,
    gets,
    create,
    remove
};
