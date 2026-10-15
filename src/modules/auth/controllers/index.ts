/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

/** constants */
import { AppKey } from '@modules/base/constants/key';
import { AppEnv } from '@modules/base/constants/env';
import { AppRegex } from '@modules/base/constants/regex';

/** utils */
import { pusherServer } from '@modules/base/utils/pusher';
import { genId } from '@modules/base/utils/gen';
import { genResponse } from '@modules/base/utils/api';
import { sendRecoverEmail } from '@modules/auth/utils/mail';
import { getAccessToken, getUidFromToken, genToken, validatePassword, validateToken } from '@modules/auth/utils/token';

/** models */
import { UserModel } from '@modules/user/models';
import { AuthModel } from '@modules/auth/models';

/** types */
import type { NextFunction, Request, Response } from 'express';

const verify = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = getAccessToken(req);

    if (!accessToken || !validateToken(accessToken)) {
        /** verify fail */
        return res.status(StatusCodes.UNAUTHORIZED).json(genResponse({ message: ReasonPhrases.UNAUTHORIZED }));
    }

    /** verify success */
    next();
};

const signin = async (
    req: App.ModuleAuth.Api.AuthControllerAction['Signin']['Request'],
    res: App.ModuleAuth.Api.AuthControllerAction['Signin']['Response'],
    next: NextFunction
) => {
    const { email, password } = req.body;

    if (!email || !password) {
        /** info fail */
        return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Missing email or password!' }));
    }

    try {
        const user = await UserModel.get({ email });

        if (!user) {
            /** wrong email */
            return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Invalid email or password!' }));
        }

        const auth = await AuthModel.get({ uid: user.id });
        if (!auth || !validatePassword(password, auth.password)) {
            /** wrong password */
            return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Invalid email or password!' }));
        }

        const accessToken = genToken(user.id, AppKey.accessToken);
        const refreshToken = genToken(user.id, AppKey.refreshToken);
        await AuthModel.update({ uid: user.id, data: { refreshToken } });

        /** signin success */
        return res.status(StatusCodes.OK).json(
            genResponse({
                data: user,
                metadata: {
                    token: { exp: AppEnv.appAccessTokenRefreshTime, value: accessToken }
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

const socket = async (
    req: App.ModuleAuth.Api.AuthControllerAction['Socket']['Request'],
    res: App.ModuleAuth.Api.AuthControllerAction['Socket']['Response'],
    next: NextFunction
) => {
    const accessToken = getAccessToken(req);
    const uid = getUidFromToken(accessToken);
    if (!uid) {
        throw new Error('❌ Không tìm thấy uid');
    }
    try {
        pusherServer.authorizeChannel(uid, uid);
        return res.status(StatusCodes.OK).json(genResponse());
    } catch (error) {
        next(error);
    }
};

const signout = async (
    req: App.ModuleAuth.Api.AuthControllerAction['Signout']['Request'],
    res: App.ModuleAuth.Api.AuthControllerAction['Signout']['Response']
) => {
    const accessToken = getAccessToken(req);
    const uid = getUidFromToken(accessToken);

    try {
        if (uid) {
            await AuthModel.update({ uid, data: { refreshToken: '' } });
        }
    } catch {
        // do logging
    }

    return res.status(StatusCodes.OK).json(genResponse());
};

const restart = async (
    req: App.ModuleAuth.Api.AuthControllerAction['Restart']['Request'],
    res: App.ModuleAuth.Api.AuthControllerAction['Restart']['Response'],
    next: NextFunction
) => {
    const accessToken = getAccessToken(req);
    const uid = getUidFromToken(accessToken);

    if (!uid) {
        /** wrong accessToken */
        return res.status(StatusCodes.UNAUTHORIZED).json(genResponse({ message: 'Invalid session!' }));
    }

    try {
        const refreshToken = await AuthModel.getToken({ uid });
        if (!refreshToken || !validateToken(refreshToken)) {
            /** wrong refreshToken */
            return res.status(StatusCodes.UNAUTHORIZED).json(genResponse({ message: 'This session has expired!' }));
        }

        const accessToken = genToken(uid, AppKey.accessToken);
        const newRefreshToken = genToken(uid, AppKey.refreshToken);
        const [user] = await Promise.all([
            UserModel.get({ uid }),
            AuthModel.update({ uid, data: { refreshToken: newRefreshToken } })
        ]);

        if (!user) {
            /** wrong email */
            return res.status(StatusCodes.UNAUTHORIZED).json(genResponse({ message: 'This session has expired!' }));
        }

        /** restart success */
        return res.status(StatusCodes.OK).json(
            genResponse({
                data: user,
                metadata: {
                    token: { exp: AppEnv.appAccessTokenRefreshTime, value: accessToken }
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

const register = async (
    req: App.ModuleAuth.Api.AuthControllerAction['Register']['Request'],
    res: App.ModuleAuth.Api.AuthControllerAction['Register']['Response'],
    next: NextFunction
) => {
    const { email, password } = req.body;

    if (!email || !password) {
        /** wrong info */
        return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Missing email or password!' }));
    }

    if (!AppRegex.email.test(email)) {
        /** wrong email */
        return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Invalid email format!' }));
    }

    if (!AppRegex.password.test(password)) {
        /** wrong password */
        return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Invalid password format!' }));
    }

    try {
        const isExisted = await UserModel.check({ email });

        if (isExisted) {
            /** register fail */
            return res.status(StatusCodes.CONFLICT).json(genResponse({ message: 'Account already exists!' }));
        }

        const uid = genId('uid');
        await Promise.all([UserModel.create({ uid, email }), AuthModel.create({ uid, password })]);

        /** register success */
        return res.status(StatusCodes.OK).json(genResponse({ message: 'User registered successfully!' }));
    } catch (error) {
        next(error);
    }
};

const recover = async (
    req: App.ModuleAuth.Api.AuthControllerAction['Recover']['Request'],
    res: App.ModuleAuth.Api.AuthControllerAction['Recover']['Response'],
    next: NextFunction
) => {
    const { email } = req.body;

    if (!email) {
        /** wrong info */
        return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Missing email!' }));
    }

    try {
        const isExisted = await UserModel.check({ email });

        if (!isExisted) {
            /** recover fail */
            return res.status(StatusCodes.NOT_FOUND).json(genResponse({ message: 'Account does not exist!' }));
        }

        await sendRecoverEmail(email);

        /** recover success */
        return res.status(StatusCodes.OK).json(genResponse({ message: 'Recovery email sent successfully!' }));
    } catch (error) {
        next(error);
    }
};

export const authController = { verify, signin, socket, signout, restart, register, recover };
