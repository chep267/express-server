/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

/** constants */
import { AppKey } from '@constants/AppKey';
import { AppEnv } from '@constants/AppEnv';
import { AppRegex } from '@constants/AppRegex';

/** utils */
import { genToken, genUid, getUidFromToken, validatePassword, validateToken } from '@utils/auth';
import { genResponse } from '@utils/genResponse';
import { sendRecoverEmail } from '@utils/mail';

/** models */
import { UserModel } from '@models/user.model';
import { AuthModel } from '@models/auth.model';

/** types */
import type { NextFunction, Request, Response } from 'express';

const clearToken = (res: Response) => {
    res.clearCookie(AppKey.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
};

const setToken = (res: Response, data: { refreshToken: string }) => {
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

const getAccessToken = (req: Request) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        /** no access token */
        return undefined;
    }

    return authHeader?.split(' ')[1];
};

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
    req: Omit<Request, 'body'> & { body: { email: string; password: string } },
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;

    if (!email || !password) {
        /** info fail */
        return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Missing email or password!' }));
    }

    try {
        const user = await UserModel.getUser({ email });

        if (!user) {
            /** wrong email */
            return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Invalid email or password!' }));
        }

        const auth = await AuthModel.getAuth({ uid: user.uid });
        if (!auth || !validatePassword(password, auth.password)) {
            /** wrong password */
            return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Invalid email or password!' }));
        }

        const accessToken = genToken(user.uid, AppKey.accessToken);
        const refreshToken = genToken(user.uid, AppKey.refreshToken);
        await AuthModel.updateAuth({ uid: user.uid, data: { refreshToken } });
        setToken(res, { refreshToken });

        /** signin success */
        return res.status(StatusCodes.OK).json(
            genResponse({
                data: {
                    user,
                    token: { exp: AppEnv.appAccessTokenRefreshTime, value: accessToken }
                }
            })
        );
    } catch (error) {
        next(error);
    }
};

const signout = async (req: Request, res: Response) => {
    const accessToken = getAccessToken(req);
    const uid = getUidFromToken(accessToken);

    try {
        if (uid) {
            await AuthModel.updateAuth({ uid, data: { refreshToken: '' } });
        }
    } catch {
        // do logging
    } finally {
        clearToken(res);
    }
    return res.status(StatusCodes.OK).json(genResponse());
};

const restart = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = getAccessToken(req);
    const refreshTokenCookie = req.cookies[AppKey.refreshToken];
    const uid = getUidFromToken(accessToken || refreshTokenCookie);

    if (!uid) {
        /** wrong accessToken */
        return res.status(StatusCodes.UNAUTHORIZED).json(genResponse({ message: 'Invalid session!' }));
    }

    const refreshToken = await AuthModel.getRefreshToken({ uid });
    if (refreshTokenCookie !== refreshToken || !validateToken(refreshToken)) {
        /** wrong refreshToken */
        return res.status(StatusCodes.UNAUTHORIZED).json(genResponse({ message: 'This session has expired!' }));
    }

    try {
        const accessToken = genToken(uid, AppKey.accessToken);
        const newRefreshToken = genToken(uid, AppKey.refreshToken);
        const [user] = await Promise.all([
            UserModel.getUser({ uid }),
            AuthModel.updateAuth({ uid, data: { refreshToken: newRefreshToken } })
        ]);
        setToken(res, { refreshToken: newRefreshToken });

        /** restart success */
        return res.status(StatusCodes.OK).json(
            genResponse({
                data: { user: user, token: { exp: AppEnv.appAccessTokenRefreshTime, value: accessToken } }
            })
        );
    } catch (error) {
        next(error);
    }
};

const register = async (
    req: Omit<Request, 'body'> & { body: { email: string; password: string } },
    res: Response,
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
        const user = await UserModel.getUser({ email });

        if (user) {
            /** register fail */
            return res.status(StatusCodes.CONFLICT).json(genResponse({ message: 'Account already exists!' }));
        }

        const uid = genUid();
        await Promise.all([UserModel.setUser({ uid, email }), AuthModel.setAuth({ uid, password })]);

        /** register success */
        return res.status(StatusCodes.OK).json(genResponse({ message: 'User registered successfully!' }));
    } catch (error) {
        next(error);
    }
};

const recover = async (req: Omit<Request, 'body'> & { body: { email: string } }, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
        /** wrong info */
        return res.status(StatusCodes.BAD_REQUEST).json(genResponse({ message: 'Missing email!' }));
    }

    try {
        const isUserExisted = await UserModel.hasUser({ email });

        if (!isUserExisted) {
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

export const apiAuth = {
    verify,
    signin,
    signout,
    restart,
    register,
    recover
};
