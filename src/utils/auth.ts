/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import jwt, { type JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/** constants */
import { AppKey } from '@constant/AppKey';
import { accessTokenExpiredTime, jwtSecretKey, refreshTokenExpiredTime } from '@constant/env';

export const genToken = (uid: string, type: typeof AppKey.accessToken | typeof AppKey.refreshToken) => {
    const iat = Date.now();
    const exp = iat + (type === AppKey.accessToken ? accessTokenExpiredTime : refreshTokenExpiredTime);
    const data = {
        uid,
        iat,
        exp,
        type
    };
    return jwt.sign(data, jwtSecretKey);
};

export const renewToken = (
    uid: string,
    type: typeof AppKey.accessToken | typeof AppKey.refreshToken,
    token: string
) => {
    try {
        const verified = jwt.verify(token, jwtSecretKey) as JwtPayload;
        return jwt.sign(
            {
                ...verified,
                iat: Date.now()
            },
            jwtSecretKey
        );
    } catch {
        return genToken(uid, type);
    }
};

export const validateToken = (uid?: string, token?: string) => {
    if (!uid || !token) return false;
    try {
        const verified = jwt.verify(token, jwtSecretKey) as JwtPayload;
        const now = Date.now();
        const exp = verified.exp || 0;
        // console.log('now: ', new Date(now));
        // console.log('expired: ', new Date(exp));
        return verified.uid === uid && now < exp;
    } catch {
        return false;
    }
};

export const validatePassword = (password?: string, hash?: string) => {
    if (!password || !hash) return false;
    return bcrypt.compareSync(password, hash);
};
