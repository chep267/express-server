/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

declare namespace NodeJS {
    interface ProcessEnv {
        readonly CHEP_SERVER_ACCESS_TOKEN_EXPIRED_TIME: string;
        readonly CHEP_SERVER_ACCESS_TOKEN_REFRESH_TIME: string;
        readonly CHEP_SERVER_REFRESH_TOKEN_EXPIRED_TIME: string;
        readonly CHEP_SERVER_JWT_SECRET_KEY: string;
        readonly CHEP_SERVER_PORT: string;
        readonly CHEP_SERVER_HOST: string;
        readonly CHEP_SERVER_WHITE_LIST: string;

        readonly CHEP_SERVER_DB_NAME: string;
        readonly CHEP_SERVER_DB_HOST: string;
        readonly CHEP_SERVER_DB_PORT: string;
        readonly CHEP_SERVER_DB_URI: string;

        readonly CHEP_SERVER_SERVICE_MAIL: string;
        readonly CHEP_SERVER_SERVICE_SMTP: string;

        readonly CHEP_SERVER_ACC_TEST_EMAIL: string;
        readonly CHEP_SERVER_ACC_TEST_PASSWORD: string;
    }
}
