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
import type { NextFunction, Response } from 'express';

type TypeUser = App.ModuleUser.Data.TypeUser;

const get = async (
    req: App.ModuleBase.Api.CustomRequestBody<{ email: TypeUser['email']; uid: TypeUser['uid'] }>,
    res: Response,
    next: NextFunction
) => {
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

export const userController = { get };
