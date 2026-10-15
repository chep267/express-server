/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { Request, Response } from 'express';
import type { ApiResponse, ApiSearchResponse, SearchParam } from '@modules/base/types/api.d';
import type { TypeFeed } from '@modules/global/types/data.d';

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/** feeds */
export interface FeedControllerAction {
    Get: {
        Request: Omit<Request, 'params'> & { params: { tid: string } };
        Response: Response<ApiResponse<TypeFeed | null>>;
    };
    Gets: {
        Request: Omit<Request, 'query'> & { query: SearchParam };
        Response: Response<ApiSearchResponse<TypeFeed[]>>;
    };
}
