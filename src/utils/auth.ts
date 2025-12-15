/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import jwt, { type JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/** constants */
import { AppKey } from '@constants/AppKey.js';
import { AppEnv } from '@constants/AppEnv.js';

export const genToken = (uid: string, type: typeof AppKey.accessToken | typeof AppKey.refreshToken) => {
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

export const renewToken = (uid: string, type: typeof AppKey.accessToken | typeof AppKey.refreshToken, token: string) => {
    try {
        const verified = jwt.verify(token, AppEnv.appJwtSecretKey) as JwtPayload;
        return jwt.sign(
            {
                ...verified,
                iat: Date.now()
            },
            AppEnv.appJwtSecretKey
        );
    } catch {
        return genToken(uid, type);
    }
};

export const validateToken = (uid?: string, token?: string) => {
    if (!uid || !token) return false;
    try {
        const verified = jwt.verify(token, AppEnv.appJwtSecretKey) as JwtPayload;
        const now = Date.now();
        const exp = verified.exp || 0;
        return verified.uid === uid && now < exp;
    } catch {
        return false;
    }
};

export const validatePassword = (password?: string, hash?: string) => {
    if (!password || !hash) return false;
    return bcrypt.compareSync(password, hash);
};
