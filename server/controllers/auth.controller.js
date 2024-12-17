/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */
/** models */
import { UserModel } from '../models/user.model.js';
/** constants */
import { AppKey } from '../constants/AppKey.js';
import { AppEnv } from '../constants/AppEnv.js';
/** utils */
import { genToken, renewToken, validatePassword, validateToken } from '../utils/auth.js';
const clearToken = (res) => {
    res.clearCookie(AppKey.accessToken);
    res.clearCookie(AppKey.refreshToken);
    res.clearCookie(AppKey.uid);
};
const setToken = (res, data) => {
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
const verify = (req, res, next) => {
    const accessToken = req.cookies[AppKey.accessToken];
    const uid = req.cookies[AppKey.uid];
    /** verify fail */
    if (!validateToken(uid, accessToken)) {
        res.status(403).json({ message: "You don't have permission!" });
    }
    else {
        /** verify success */
        next();
    }
};
const signin = async (req, res, next) => {
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
        const { _id, // eslint-disable-line @typescript-eslint/no-unused-vars
        password: hash, // eslint-disable-line @typescript-eslint/no-unused-vars
        refreshToken: rf, // eslint-disable-line @typescript-eslint/no-unused-vars
        ...userData } = user;
        const accessToken = genToken(userData.uid, AppKey.accessToken);
        const refreshToken = genToken(userData.uid, AppKey.refreshToken);
        await UserModel.updateUser({ uid: userData.uid, data: { refreshToken } });
        setToken(res, { uid: userData.uid, accessToken, refreshToken });
        return res
            .status(200)
            .json({ message: 'ok', data: { user: userData, token: { exp: AppEnv.appAccessTokenRefreshTime } } });
    }
    catch (error) {
        next(error);
    }
};
const signout = async (req, res) => {
    const uid = req.cookies[AppKey.uid];
    try {
        await UserModel.updateUser({ uid, data: { refreshToken: '' } });
    }
    catch {
        // do logging
    }
    finally {
        clearToken(res);
    }
    return res.status(200).json({ message: 'ok', status: 200 });
};
const refresh = async (req, res, next) => {
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
        const { _id, // eslint-disable-line
        password, // eslint-disable-line
        refreshToken: rf, // eslint-disable-line
        ...userData } = await UserModel.updateUser({ uid, data: { refreshToken } });
        setToken(res, { uid, accessToken, refreshToken });
        return res
            .status(200)
            .json({ message: 'ok', data: { user: userData, token: { exp: AppEnv.appAccessTokenRefreshTime } } });
    }
    catch (error) {
        next(error);
    }
};
const restart = async (req, res, next) => {
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
const register = async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
const recover = async (req, res, next) => {
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
    }
    catch (error) {
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
