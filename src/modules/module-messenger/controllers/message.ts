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

/** models */
import { ThreadModel } from '@module-messenger/models/thread';
import { MessageModel } from '@module-messenger/models/message';

/** types */
import type { NextFunction } from 'express';

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
        const [message] = await Promise.all([
            MessageModel.create({ data: { ...data, id: mid } }),
            ThreadModel.addMessage({ tid: data.tid, uid: data.uid, mid })
        ]);
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
        const thread = await MessageModel.remove({ mid });
        // if (thread) {
        //     thread.uids.forEach((id) => {
        //         io?.to(id).emit('THREAD_REMOVED', { id: thread.id });
        //     });
        // }
        return res.status(StatusCodes.OK).json(genResponse({ data: Boolean(thread) }));
    } catch (error) {
        next(error);
    }
};

export const messageController = {
    gets,
    create,
    remove
};
