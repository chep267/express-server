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

const get = async (req: App.ModuleUser.Api.Get['Request'], res: App.ModuleUser.Api.Get['Response'], next: NextFunction) => {
    const { email, uid } = req.body;
    try {
        const user = await UserModel.getUser({ email, uid });

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

const getUsers = async (
    req: App.ModuleUser.Api.GetList['Request'],
    res: App.ModuleUser.Api.GetList['Response'],
    next: NextFunction
) => {
    const { searchKey, page = '1', limit = '20' } = req.query;
    const limitNumber = parseInt(limit, 10) || 10;

    try {
        const users = await UserModel.getUsers({ searchKey, page, limit });
        const totalItems = users.length;
        const totalPages = Math.ceil(totalItems / limitNumber);

        /** success */
        return res.status(StatusCodes.OK).json(
            genResponse({
                data: users,
                metadata: {
                    totalItems,
                    totalPages,
                    currentPage: Number(page)
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

export const userController = { get, getUsers };
