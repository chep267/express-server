/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { v7 as uuidV7 } from 'uuid';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/** constants */
import { AppKey } from '@constants/AppKey';
import { AppEnv } from '@constants/AppEnv';

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

export const validateToken = (token?: string) => {
    if (!token) return false;
    try {
        const verified = jwt.verify(token, AppEnv.appJwtSecretKey) as JwtPayload;
        const now = Date.now();
        const exp = verified.exp ?? 0;
        return now < exp;
    } catch {
        return false;
    }
};

export const validatePassword = (password?: string, hash?: string) => {
    if (!password || !hash) return false;
    return bcrypt.compareSync(password, hash);
};

export const genUid = () => `uid.${uuidV7()}`;

export const getUidFromToken = (token?: string) => {
    if (!token) return undefined;
    try {
        const verified = jwt.verify(token, AppEnv.appJwtSecretKey) as JwtPayload;
        return verified.uid as string;
    } catch {
        return undefined;
    }
};
