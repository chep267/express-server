/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import jwt, { type JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/** constants */
import { AppKey } from '@module-base/constants/AppKey';
import { AppEnv } from '@module-base/constants/AppEnv';

/** types */
import type { Request, Response } from 'express';

export const clearToken = (res: Response) => {
    res.clearCookie(AppKey.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
};

export const setToken = (res: Response, data: { refreshToken: string }) => {
    const { refreshToken } = data;
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const
    };
    res.cookie(AppKey.refreshToken, refreshToken, {
        ...cookieOptions,
        maxAge: AppEnv.appRefreshTokenExpiredTime
    });
};

export const getAccessToken = (req: Request) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        /** no access token */
        return undefined;
    }

    return authHeader?.split(' ')[1];
};

export const genToken = (
    uid: App.ModuleUser.Data.TypeUser['uid'],
    type: typeof AppKey.accessToken | typeof AppKey.refreshToken
) => {
    const iat = Date.now();
    const exp = iat + (type === AppKey.accessToken ? AppEnv.appAccessTokenExpiredTime : AppEnv.appRefreshTokenExpiredTime);
    const data = {
        uid,
        iat,
        exp,
        type
    };
    return jwt.sign(data, AppEnv.appJwtSecretKey);
};

export const validateToken = (token?: string) => {
    if (!token) return false;
    try {
        const verified = jwt.verify(token, AppEnv.appJwtSecretKey) as JwtPayload;
        const now = Date.now();
        const exp = verified.exp ?? 0;
        return now < exp && Boolean(verified.uid);
    } catch {
        return false;
    }
};

export const validatePassword = (password?: string, hash?: string) => {
    if (!password || !hash) return false;
    return bcrypt.compareSync(password, hash);
};

export const getUidFromToken = (token?: string) => {
    if (!token) return undefined;
    try {
        const verified = jwt.verify(token, AppEnv.appJwtSecretKey) as JwtPayload;
        return verified.uid as string;
    } catch {
        return undefined;
    }
};
