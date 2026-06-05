/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes } from 'http-status-codes';

/** models */
import { UserModel } from '@module-user/models';

/** utils */
import { genResponse } from '@module-base/utils/api';

/** types */
import type { NextFunction } from 'express';

const get = async (
    req: App.ModuleUser.Api.Users['Get']['Request'],
    res: App.ModuleUser.Api.Users['Get']['Response'],
    next: NextFunction
) => {
    const { uid } = req.params;
    try {
        const user = await UserModel.get({ uid });

        if (!user) {
            /** fail */
            return res.status(StatusCodes.NOT_FOUND).json(genResponse({ message: 'No user found!' }));
        }

        /** success */
        return res.status(StatusCodes.OK).json(genResponse({ data: user }));
    } catch (error) {
        next(error);
    }
};

const gets = async (
    req: App.ModuleUser.Api.Users['Gets']['Request'],
    res: App.ModuleUser.Api.Users['Gets']['Response'],
    next: NextFunction
) => {
    try {
        const { data, metadata } = await UserModel.gets(req.query);
        return res.status(StatusCodes.OK).json(genResponse({ data, metadata }));
    } catch (error) {
        next(error);
    }
};

export const userController = { get, gets };
