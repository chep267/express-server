/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

declare namespace NodeJS {
    interface ProcessEnv {
        readonly VITE_APP_SERVER_ACCESS_TOKEN_EXPIRED_TIME: string;
        readonly VITE_APP_SERVER_ACCESS_TOKEN_REFRESH_TIME: string;
        readonly VITE_APP_SERVER_REFRESH_TOKEN_EXPIRED_TIME: string;
        readonly VITE_APP_SERVER_JWT_SECRET_KEY: string;
        readonly VITE_APP_SERVER_PORT: string;
        readonly VITE_APP_SERVER_HOST: string;
        readonly VITE_APP_SERVER_WHITE_LIST: string;

        readonly VITE_APP_SERVER_DB_NAME: string;
        readonly VITE_APP_SERVER_DB_HOST: string;
        readonly VITE_APP_SERVER_DB_PORT: string;
        readonly VITE_APP_SERVER_DB_URI: string;

        readonly VITE_APP_SERVER_SERVICE_MAIL: string;
        readonly VITE_APP_SERVER_SERVICE_SMTP: string;

        readonly VITE_APP_SERVER_ACC_TEST_EMAIL: string;
        readonly VITE_APP_SERVER_ACC_TEST_PASSWORD: string;

        readonly VITE_APP_SERVER_PUSHER_APP_ID: string;
        readonly VITE_APP_SERVER_PUSHER_KEY: string;
        readonly VITE_APP_SERVER_PUSHER_SECRET: string;
        readonly VITE_APP_SERVER_PUSHER_CLUSTER: string;
    }
}
