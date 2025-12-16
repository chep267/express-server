/**
 *
 * @author dongntd267@gmail.com on 26/07/2024.
 *
 */

/** libs */
import dotenv from 'dotenv';

dotenv.config();

export const AppEnv = {
    appAccessTokenExpiredTime: Number(process.env.CHEP_SERVER_ACCESS_TOKEN_EXPIRED_TIME),
    appAccessTokenRefreshTime: Number(process.env.CHEP_SERVER_ACCESS_TOKEN_REFRESH_TIME),
    appRefreshTokenExpiredTime: Number(process.env.CHEP_SERVER_REFRESH_TOKEN_EXPIRED_TIME),
    appJwtSecretKey: `${process.env.CHEP_SERVER_JWT_SECRET_KEY}`,
    appPort: Number(process.env.CHEP_SERVER_PORT),
    appHost: process.env.CHEP_SERVER_HOST,
    appWhiteList: `${process.env.CHEP_SERVER_WHITE_LIST}`,

    dbName: `${process.env.CHEP_SERVER_DB_NAME}`,
    dbHost: `${process.env.CHEP_SERVER_DB_HOST}`,
    dbPort: Number(process.env.CHEP_SERVER_DB_PORT),
    dbUri: `${process.env.CHEP_SERVER_DB_URI}`
} as const;
