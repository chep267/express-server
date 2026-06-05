/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { Request, Response } from 'express';
import type { ApiResponse, ApiSearchResponse, SearchParam } from '@module-base/types/api.d';
import type { TypeThread, TypeMessage, TypeAttachment } from '@module-messenger/types/data.d';

/** threads */
export interface Threads {
    Gets: {
        Request: Omit<Request, 'query'> & { query: SearchParam };
        Response: Response<ApiSearchResponse<TypeThread[]>>;
    };
    Create: {
        Request: Omit<Request, 'body'> & { body: { data: TypeThread } };
        Response: Response<ApiResponse<TypeThread>>;
    };
    Update: {
        Request: Omit<Request, 'body'> & { body: { data: TypeMessage } };
        Response: Response<ApiResponse<TypeThread | null>>;
    };
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/** messages */
export interface Messages {
    Gets: {
        Request: Omit<Request, 'params' | 'query'> & {
            params: { tid: string };
            query: SearchParam;
        };
        Response: Response<ApiSearchResponse<TypeMessage[]>>;
    };
    Create: {
        Request: Omit<Request, 'params' | 'body'> & { params: { tid: string }; body: { data: TypeMessage } };
        Response: Response<ApiResponse<TypeMessage>>;
    };
    Update: {
        Request: Omit<Request, 'body'> & { body: { data: TypeMessage } };
        Response: Response<ApiResponse<TypeMessage>>;
    };
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/**pi attachments */
export interface Attachment {
    Create: {
        Request: Omit<Request, 'body'> & { body: { data: TypeAttachment } };
        Response: Response<ApiResponse<TypeAttachment>>;
    };
}
