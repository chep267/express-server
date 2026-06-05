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
import { ThreadModel } from '@module-messenger/models';

/** types */
import type { NextFunction } from 'express';

const gets = async (
    req: App.ModuleMessenger.Api.Threads['Gets']['Request'],
    res: App.ModuleMessenger.Api.Threads['Gets']['Response'],
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
    req: App.ModuleMessenger.Api.Threads['Create']['Request'],
    res: App.ModuleMessenger.Api.Threads['Create']['Response'],
    next: NextFunction
) => {
    try {
        const { data } = req.body;
        const tid = genId('tid');
        const thread = await ThreadModel.create({ data: { ...data, tid } });
        return res.status(StatusCodes.CREATED).json(genResponse({ data: thread }));
    } catch (error) {
        next(error);
    }
};

const update = async (
    req: App.ModuleMessenger.Api.Threads['Update']['Request'],
    res: App.ModuleMessenger.Api.Threads['Update']['Response'],
    next: NextFunction
) => {
    try {
        const thread = await ThreadModel.update(req.body);
        return res.status(StatusCodes.OK).json(genResponse({ data: thread }));
    } catch (error) {
        next(error);
    }
};

export const threadController = {
    gets,
    create,
    update
};
