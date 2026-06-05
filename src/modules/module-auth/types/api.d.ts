/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { ApiResponse } from '@module-base/types/api.d';
import type { TypeUser } from '@module-user/types/data.d';
import type { Request, Response } from 'express';

/** auths */
export interface Auths {
    Signin: {
        Request: Omit<Request, 'body'> & { body: { email: string; password: string } };
        Response: Response<ApiResponse<TypeUser, { token?: { exp: string; value: string } }>>;
    };
    Signout: {
        Request: Request;
        Response: Response<ApiResponse<null>>;
    };
    Restart: {
        Request: Request;
        Response: Response<ApiResponse<TypeUser, { token?: { exp: string; value: string } }>>;
    };
    Register: {
        Request: Omit<Request, 'body'> & { body: { email: string; password: string } };
        Response: Response<ApiResponse<null>>;
    };
    Recover: {
        Request: Omit<Request, 'body'> & { body: { email: string } };
        Response: Response<ApiResponse<null>>;
    };
}
