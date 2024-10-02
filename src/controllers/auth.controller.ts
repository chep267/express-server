/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** models */
import { UserModel } from '@model/user.model';

/** constants */
import { AppKey } from '@constant/AppKey';
import { accessTokenExpiredTime, accessTokenRefreshTime, refreshTokenExpiredTime } from '@constant/env';

/** utils */
import { genToken, renewToken, validatePassword, validateToken } from '@util/auth';

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
        maxAge: Number(accessTokenExpiredTime),
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    res.cookie(AppKey.accessToken, accessToken, {
        maxAge: Number(accessTokenExpiredTime),
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    res.cookie(AppKey.refreshToken, refreshToken, {
        maxAge: Number(refreshTokenExpiredTime),
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
        return res.status(403).json({ message: "You don't have permission!" });
    }
    /** verify success */
    return next();
};

const signin = async (
    req: Omit<Request, 'body'> & { body: { email: string; password: string } },
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password!' });
    }
    try {
        const user = await UserModel.getUser({ email });
        /** signin fail */
        if (!user || !validatePassword(password, user.password)) {
            return res.status(401).json({ message: 'Email and password are incorrect!' });
        }
        /** signin success */
        const { _id, password: hash, refreshToken: _rf, ...userData } = user;
        const accessToken = genToken(userData.uid, AppKey.accessToken);
        const refreshToken = genToken(userData.uid, AppKey.refreshToken);
        await UserModel.updateUser({ uid: userData.uid, data: { refreshToken } });
        setToken(res, { uid: userData.uid, accessToken, refreshToken });
        return res
            .status(200)
            .json({ message: 'ok', data: { user: userData, token: { exp: accessTokenRefreshTime } } });
    } catch (error) {
        next(error);
    }
};

const signout = async (req: Request, res: Response) => {
    const uid = req.cookies[AppKey.uid];
    try {
        await UserModel.updateUser({ uid, data: { refreshToken: '' } });
    } catch (error) {
        // do logging
    } finally {
        clearToken(res);
    }
    return res.status(200).json({ message: 'ok', status: 200 });
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const cookieRefreshToken = req.cookies[AppKey.refreshToken];
    const uid = req.cookies[AppKey.uid];
    try {
        const oldRefreshToken = await UserModel.getRefreshToken({ uid });
        /** refresh fail */
        if (cookieRefreshToken !== oldRefreshToken) {
            clearToken(res);
            return res.status(401).json({ message: 'This session has expired!' });
        }
        /** refresh success */
        const accessToken = genToken(uid, AppKey.accessToken);
        const refreshToken = renewToken(uid, AppKey.refreshToken, cookieRefreshToken);
        const {
            _id,
            password,
            refreshToken: rf,
            ...userData
        } = await UserModel.updateUser({ uid, data: { refreshToken } });
        setToken(res, { uid, accessToken, refreshToken });
        return res
            .status(200)
            .json({ message: 'ok', data: { user: userData, token: { exp: accessTokenRefreshTime } } });
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
        return res.status(401).json({ message: 'This session has expired!' });
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
        return res.status(400).json({ message: 'Missing email or password!' });
    }
    try {
        const user = await UserModel.getUser({ email });
        /** register fail */
        if (user) {
            return res.status(409).json({ message: 'Account already exists!' });
        }
        /** register success */
        await UserModel.setUser({ email, password });
        return res.status(200).json({ message: 'ok' });
    } catch (error) {
        next(error);
    }
};

const recover = async (req: Omit<Request, 'body'> & { body: { email: string } }, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Missing email or password!' });
    }
    try {
        const user = await UserModel.getUser({ email });
        /** recover fail */
        if (!user) {
            return res.status(409).json({ message: "Account doesn't exists!" });
        }
        /** recover success */
        return res.status(200).json({ message: 'ok' });
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
