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
import { MessageModel, ThreadModel } from '@module-messenger/models';

/** types */
import type { NextFunction } from 'express';

const gets = async (
    req: App.ModuleMessenger.Api.Messages['Gets']['Request'],
    res: App.ModuleMessenger.Api.Messages['Gets']['Response'],
    next: NextFunction
) => {
    try {
        const { tid } = req.params;
        const { items, ...metadata } = await MessageModel.gets({ ...req.query, tid });
        return res.status(StatusCodes.OK).json(genResponse({ data: items, metadata }));
    } catch (error) {
        next(error);
    }
};

const create = async (
    req: App.ModuleMessenger.Api.Messages['Create']['Request'],
    res: App.ModuleMessenger.Api.Messages['Create']['Response'],
    next: NextFunction
) => {
    try {
        const { tid } = req.params;
        const { data } = req.body;
        const mid = genId('mid');
        const message = await MessageModel.create({ data: { ...data, tid, mid } });
        await ThreadModel.update({ data: message });
        return res.status(StatusCodes.CREATED).json(genResponse({ data: message }));
    } catch (error) {
        next(error);
    }
};

export const messageController = {
    gets,
    create
};
