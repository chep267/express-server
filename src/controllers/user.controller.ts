/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes } from 'http-status-codes';

/** models */
import { UserModel } from '@models/user.model';

/** utils */
import { genResponse } from '@utils/genResponse';

/** types */
import type { NextFunction, Request, Response } from 'express';

const create = async (
    req: Omit<Request, 'body'> & { body: { email: string; password: string } },
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;
    try {
        const userFind = await UserModel.findOne({ email }).exec();
        /** Fail */
        if (userFind) {
            return res.status(StatusCodes.CONFLICT).json({ message: 'Account already exists!' });
        }
        /** Success */
        const user = {
            email,
            password
        };
        res.status(StatusCodes.OK).json(genResponse({ data: { user } }));
    } catch (error) {
        next(error);
    }
};

export const apiUser = {
    create
};
