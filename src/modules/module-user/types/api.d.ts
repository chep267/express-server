/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { Request, Response } from 'express';
import type { ApiResponse, ApiSearchResponse, SearchParam } from '@module-base/types/api.d';
import type { TypeUser } from '@module-user/types/data.d';

/** users */
export interface Users {
    Get: {
        Request: Omit<Request, 'params'> & {
            params: { uid: string };
        };
        Response: Response<ApiResponse<TypeUser>>;
    };
    Gets: {
        Request: Omit<Request, 'params' | 'query'> & {
            params: { tid: string };
            query: SearchParam;
        };
        Response: Response<ApiSearchResponse<TypeUser[]>>;
    };
    Create: {
        Request: Omit<Request, 'body'> & { body: { data: TypeUser } };
        Response: Response<ApiResponse<TypeUser>>;
    };
    Update: {
        Request: Omit<Request, 'body'> & { body: { data: TypeUser } };
        Response: Response<ApiResponse<TypeUser | null>>;
    };
}
