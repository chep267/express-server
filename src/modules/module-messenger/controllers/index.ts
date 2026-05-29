/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes } from 'http-status-codes';

/** utils */
import { genResponse } from '@module-base/utils/api';
import { MessageModel } from '@module-messenger/models';

/** controllers */
import { threadController } from '@module-messenger/controllers/thread.controller';

/** types */
import type { NextFunction } from 'express';

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
    ...threadController,
    getMessages
};
