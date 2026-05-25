/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import { CustomRequestAll, CustomRequestParam, CustomResponse } from '@module-base/types/api.d';
import type { TypeThread, TypeMessage } from '@module-messenger/types/data.d';

/** api thread */
export interface GetThreads {
    Request: CustomRequestParam<{ uid?: string; searchKey?: string; page?: string; skip?: string; limit?: string }>;
    Response: CustomResponse<TypeThread[], { total?: number; count?: number }>;
}

/** api message */
export interface GetMessages {
    Request: CustomRequestAll<{ tid?: string }, { searchKey?: string; page?: string; skip?: string; limit?: string }>;
    Response: CustomResponse<TypeMessage[], { total?: number; count?: number }>;
}
