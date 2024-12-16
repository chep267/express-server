/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */
/** libs */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
/** constants */
import { AppKey } from '../constants/AppKey.js';
import { AppEnv } from '../constants/AppEnv.js';
export const genToken = (uid, type) => {
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
export const renewToken = (uid, type, token) => {
    try {
        const verified = jwt.verify(token, AppEnv.appJwtSecretKey);
        return jwt.sign({
            ...verified,
            iat: Date.now()
        }, AppEnv.appJwtSecretKey);
    }
    catch {
        return genToken(uid, type);
    }
};
export const validateToken = (uid, token) => {
    if (!uid || !token)
        return false;
    try {
        const verified = jwt.verify(token, AppEnv.appJwtSecretKey);
        const now = Date.now();
        const exp = verified.exp || 0;
        return verified.uid === uid && now < exp;
    }
    catch {
        return false;
    }
};
export const validatePassword = (password, hash) => {
    if (!password || !hash)
        return false;
    return bcrypt.compareSync(password, hash);
};
