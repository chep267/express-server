/**
 *
 * @author dongntd267@gmail.com on 26/07/2024.
 *
 */

/** libs */
import dotenv from 'dotenv';

dotenv.config();

export const AppEnv = {
    appAccessTokenExpiredTime: Number(process.env.VITE_APP_SERVER_ACCESS_TOKEN_EXPIRED_TIME),
    appAccessTokenRefreshTime: Number(process.env.VITE_APP_SERVER_ACCESS_TOKEN_REFRESH_TIME),
    appRefreshTokenExpiredTime: Number(process.env.VITE_APP_SERVER_REFRESH_TOKEN_EXPIRED_TIME),
    appJwtSecretKey: process.env.VITE_APP_SERVER_JWT_SECRET_KEY,
    appPort: Number(process.env.VITE_APP_SERVER_PORT),
    appHost: process.env.VITE_APP_SERVER_HOST,
    appWhiteList: process.env.VITE_APP_SERVER_WHITE_LIST,

    dbName: process.env.VITE_APP_SERVER_DB_NAME,
    dbHost: process.env.VITE_APP_SERVER_DB_HOST,
    dbPort: Number(process.env.VITE_APP_SERVER_DB_PORT),
    dbUri: process.env.VITE_APP_SERVER_DB_URI,

    service: {
        mail: process.env.VITE_APP_SERVER_SERVICE_MAIL,
        smtp: process.env.VITE_APP_SERVER_SERVICE_SMTP
    },

    pusher: {
        appId: process.env.VITE_APP_SERVER_PUSHER_APP_ID,
        key: process.env.VITE_APP_SERVER_PUSHER_KEY,
        secret: process.env.VITE_APP_SERVER_PUSHER_SECRET,
        cluster: process.env.VITE_APP_SERVER_PUSHER_CLUSTER
    }
} as const;
