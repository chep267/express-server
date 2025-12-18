/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

/** models */
import { UserModel } from '@models/user.model';

/** constants */
import { AppKey } from '@constants/AppKey';
import { AppEnv } from '@constants/AppEnv';

/** utils */
import { genToken, renewToken, validatePassword, validateToken } from '@utils/auth';
import { genResponse } from '@utils/genResponse';

/** types */
import type { NextFunction, Request, Response } from 'express';

const clearToken = (res: Response) => {
    res.clearCookie(AppKey.accessToken);
    res.clearCookie(AppKey.refreshToken);
    res.clearCookie(AppKey.uid);
};

const setToken = (res: Response, data: { uid: string; accessToken: string; refreshToken: string }) => {
    const { uid, accessToken, refreshToken } = data;
    res.cookie(AppKey.uid, uid, {
        maxAge: AppEnv.appAccessTokenExpiredTime,
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    res.cookie(AppKey.accessToken, accessToken, {
        maxAge: AppEnv.appAccessTokenExpiredTime,
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    res.cookie(AppKey.refreshToken, refreshToken, {
        maxAge: AppEnv.appRefreshTokenExpiredTime,
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
};

const verify = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies[AppKey.accessToken];
    const uid = req.cookies[AppKey.uid];
    /** verify fail */
    if (!validateToken(uid, accessToken)) {
        res.status(StatusCodes.UNAUTHORIZED).json(genResponse({ message: ReasonPhrases.UNAUTHORIZED }));
        return clearToken(res);
    } else {
        /** verify success */
        next();
    }
};

const signin = async (
    req: Omit<Request, 'body'> & { body: { email: string; password: string } },
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Missing email or password!' }));
    }
    try {
        const user = await UserModel.getUser({ email });
        /** signin fail */
        if (!user || !validatePassword(password, user.password)) {
            return res.status(StatusCodes.UNAUTHORIZED).json(genResponse({ message: 'Invalid email or password!' }));
        }
        /** signin success */
        const {
            _id, // eslint-disable-line @typescript-eslint/no-unused-vars
            password: hash, // eslint-disable-line @typescript-eslint/no-unused-vars
            refreshToken: rf, // eslint-disable-line @typescript-eslint/no-unused-vars
            ...userData
        } = user;
        const accessToken = genToken(userData.uid, AppKey.accessToken);
        const refreshToken = genToken(userData.uid, AppKey.refreshToken);
        await UserModel.updateUser({ uid: userData.uid, data: { refreshToken } });
        setToken(res, { uid: userData.uid, accessToken, refreshToken });
        return res.status(StatusCodes.OK).json(
            genResponse({
                data: {
                    user: userData,
                    token: { exp: AppEnv.appAccessTokenRefreshTime }
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

const signout = async (req: Request, res: Response) => {
    const uid = req.cookies[AppKey.uid];
    try {
        await UserModel.updateUser({ uid, data: { refreshToken: '' } });
    } catch {
        // do logging
    } finally {
        clearToken(res);
    }
    return res.status(StatusCodes.OK).json(genResponse());
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const cookieRefreshToken = req.cookies[AppKey.refreshToken];
    const uid = req.cookies[AppKey.uid];
    try {
        const oldRefreshToken = await UserModel.getRefreshToken({ uid });
        /** refresh fail */
        if (cookieRefreshToken !== oldRefreshToken) {
            clearToken(res);
            return res.status(StatusCodes.UNAUTHORIZED).json(genResponse({ message: 'This session has expired!' }));
        }
        /** refresh success */
        const accessToken = genToken(uid, AppKey.accessToken);
        const refreshToken = renewToken(uid, AppKey.refreshToken, cookieRefreshToken);
        const {
            _id, // eslint-disable-line
            password, // eslint-disable-line
            refreshToken: rf, // eslint-disable-line
            ...userData
        } = await UserModel.updateUser({ uid, data: { refreshToken } });
        setToken(res, { uid, accessToken, refreshToken });
        return res
            .status(StatusCodes.OK)
            .json(genResponse({ data: { user: userData, token: { exp: AppEnv.appAccessTokenRefreshTime } } }));
    } catch (error) {
        next(error);
    }
};

const restart = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies[AppKey.refreshToken];
    const uid = req.cookies[AppKey.uid];
    /** restart fail */
    if (!validateToken(uid, refreshToken)) {
        clearToken(res);
        return res.status(StatusCodes.UNAUTHORIZED).json(genResponse({ message: 'This session has expired!' }));
    }
    /** restart success */
    return refresh(req, res, next);
};

const register = async (
    req: Omit<Request, 'body'> & { body: { email: string; password: string } },
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Missing email or password!' }));
    }
    try {
        const user = await UserModel.getUser({ email });
        /** register fail */
        if (user) {
            return res.status(StatusCodes.CONFLICT).json(genResponse({ message: 'Account already exists!' }));
        }
        /** register success */
        await UserModel.setUser({ email, password });
        return res.status(StatusCodes.OK).json(genResponse());
    } catch (error) {
        next(error);
    }
};

const recover = async (req: Omit<Request, 'body'> & { body: { email: string } }, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
        return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Missing email or password!' }));
    }
    try {
        const user = await UserModel.getUser({ email });
        /** recover fail */
        if (!user) {
            return res.status(StatusCodes.CONFLICT).json(genResponse({ message: 'Account does not exist!' }));
        }
        /** recover success */
        return res.status(StatusCodes.OK).json(genResponse());
    } catch (error) {
        next(error);
    }
};

export const apiAuth = {
    verify,
    signin,
    signout,
    refresh,
    restart,
    register,
    recover
};
