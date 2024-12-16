/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */
import type { NextFunction, Request, Response } from 'express';

/** models */
import { UserModel } from '../models/user.model';

const create = async (
    req: Omit<Request, 'body'> & { body: { email: string; password: string } },
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;
    try {
        const userFind = await UserModel.findOne({ email }).exec();
        // Fail
        if (userFind) {
            res.status(405).json({ message: 'Account already exists!' });
            return;
        }
        // Success
        const user = {
            email,
            password
        };
        res.status(200).json({ message: 'ok', data: { user } });
    } catch (error) {
        next(error);
    }
};

export const apiUser = {
    create
};
