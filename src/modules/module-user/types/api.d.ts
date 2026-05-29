/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { TypeUser } from '@module-user/types/data.d';
import type { CustomRequestParam, CustomRequestQuery, CustomResponse } from '@module-base/types/api.d';

/** api get */
export interface Get {
    Request: CustomRequestParam<{
        uid: string;
    }>;
    Response: CustomResponse<TypeUser>;
}

/** api get list */
export type TypeGetListQuery = {
    q?: string;
    page?: string;
    limit?: string;
};
export interface GetList {
    Request: CustomRequestQuery<TypeGetListQuery>;
    Response: CustomResponse<TypeUser[]>;
}
