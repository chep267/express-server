/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import { CustomRequestAll, CustomRequestBody, CustomRequestParam, CustomResponse } from '@module-base/types/api.d';
import type { TypeThread, TypeMessage } from '@module-messenger/types/data.d';

/** api thread */
export interface GetThreads {
    Request: CustomRequestParam<{ q?: string; page?: string; skip?: string; limit?: string }>;
    Response: CustomResponse<TypeThread[], { total?: number; count?: number }>;
}
export interface CreateThread {
    Request: CustomRequestBody<{ data: TypeThread }>;
    Response: CustomResponse<TypeThread>;
}
export interface UpdateThread {
    Request: CustomRequestBody<{ data: TypeMessage }>;
    Response: CustomResponse<TypeThread>;
}

/** api message */
export interface GetMessages {
    Request: CustomRequestAll<{ tid?: string }, { q?: string; page?: string; skip?: string; limit?: string }>;
    Response: CustomResponse<TypeMessage[], { total?: number; count?: number }>;
}
