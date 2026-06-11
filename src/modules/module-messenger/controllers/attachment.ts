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
import { AttachmentModel } from '@module-messenger/models/attachment';

/** types */
import type { NextFunction } from 'express';

const create = async (
    req: App.ModuleMessenger.Api.AttachmentControllerAction['Create']['Request'],
    res: App.ModuleMessenger.Api.AttachmentControllerAction['Create']['Response'],
    next: NextFunction
) => {
    try {
        const { data } = req.body;
        const fid = genId('fid');
        const attachment = await AttachmentModel.create({ data: { ...data, id: fid } });
        return res.status(StatusCodes.CREATED).json(genResponse({ data: attachment }));
    } catch (error) {
        next(error);
    }
};

export const attachmentController = {
    create
};
