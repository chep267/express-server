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

/** utils */
import { genId } from '@module-base/utils/gen';

type TypeUser = App.ModuleUser.Data.TypeUser;

export const genToken = (uid: TypeUser['uid'], type: typeof AppKey.accessToken | typeof AppKey.refreshToken) => {
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

export const validateToken = (token?: string | null) => {
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

export const genUid = () => genId('uid');

export const getUidFromToken = (token?: string) => {
    if (!token) return undefined;
    try {
        const verified = jwt.verify(token, AppEnv.appJwtSecretKey) as JwtPayload;
        return verified.uid as string;
    } catch {
        return undefined;
    }
};
