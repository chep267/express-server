/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { Request, Response } from 'express';
import type { ApiResponse } from '@modules/base/types/api.d';
import type { TypeUser } from '@modules/user/types/data.d';

/** auths */
export interface AuthControllerAction {
    Signin: {
        Request: Omit<Request, 'body'> & { body: { email: string; password: string } };
        Response: Response<ApiResponse<TypeUser, { token: { exp: number; value: string } }>>;
    };
    Signout: {
        Request: Request;
        Response: Response<ApiResponse<null>>;
    };
    Socket: {
        Request: Request;
        Response: Response<ApiResponse<null>>;
    };
    Restart: {
        Request: Request;
        Response: Response<ApiResponse<TypeUser, { token: { exp: number; value: string } }>>;
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
