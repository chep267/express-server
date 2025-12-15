/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

interface ImportMetaEnv {
    readonly CHEP_SERVER_ACCESS_TOKEN_EXPIRED_TIME: string;
    readonly CHEP_SERVER_ACCESS_TOKEN_REFRESH_TIME: string;
    readonly CHEP_SERVER_REFRESH_TOKEN_EXPIRED_TIME: string;
    readonly CHEP_SERVER_JWT_SECRET_KEY: string;
    readonly CHEP_SERVER_PORT: string;
    readonly CHEP_SERVER_WHITE_LIST: string;

    readonly CHEP_SERVER_DB_NAME: string;
    readonly CHEP_SERVER_DB_HOST: string;
    readonly CHEP_SERVER_DB_PORT: string;
    readonly CHEP_SERVER_DB_URI: string;
}

declare global {
    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}
