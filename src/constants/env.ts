/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

export const accessTokenExpiredTime = Number(process.env.CHEP_SERVER_ACCESS_TOKEN_EXPIRED_TIME);

export const accessTokenRefreshTime = Number(process.env.CHEP_SERVER_ACCESS_TOKEN_REFRESH_TIME);

export const refreshTokenExpiredTime = Number(process.env.CHEP_SERVER_REFRESH_TOKEN_EXPIRED_TIME);

export const jwtSecretKey = `${process.env.CHEP_SERVER_JWT_SECRET_KEY}`;
