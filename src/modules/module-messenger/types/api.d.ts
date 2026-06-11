/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { Request, Response } from 'express';
import type { ApiResponse, ApiSearchResponse, SearchParam } from '@module-base/types/api.d';
import type { TypeThread, TypeMessage, TypeAttachment } from '@module-messenger/types/data.d';

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/** threads */
export interface ThreadControllerAction {
    Gets: {
        Request: Omit<Request, 'query'> & { query: SearchParam };
        Response: Response<ApiSearchResponse<TypeThread[]>>;
    };
    Create: {
        Request: Omit<Request, 'body'> & { body: { data: TypeThread } };
        Response: Response<ApiResponse<TypeThread>>;
    };
    Update: {
        Request: Omit<Request, 'params' | 'body'> & { params: { tid: string }; body: { data: Partial<TypeThread> } };
        Response: Response<ApiResponse<TypeThread | null>>;
    };
    Read: {
        Request: Omit<Request, 'params'> & { params: { tid: string } };
        Response: Response<ApiResponse<TypeThread | null>>;
    };
    Remove: {
        Request: Omit<Request, 'params'> & { params: { tid: string } };
        Response: Response<ApiResponse<boolean>>;
    };
}

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/** messages */
export interface MessageControllerAction {
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
        Request: Omit<Request, 'body'> & { body: { data: Partial<TypeMessage> } };
        Response: Response<ApiResponse<TypeMessage>>;
    };
    Remove: {
        Request: Omit<Request, 'params'> & { params: { mid: string } };
        Response: Response<ApiResponse<boolean>>;
    };
}

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/**pi attachments */
export interface AttachmentControllerAction {
    Gets: {
        Request: Omit<Request, 'params' | 'query'> & {
            params: { mid: string };
            query: SearchParam;
        };
        Response: Response<ApiSearchResponse<TypeMessage[]>>;
    };
    Create: {
        Request: Omit<Request, 'body'> & { body: { data: TypeAttachment } };
        Response: Response<ApiResponse<TypeAttachment>>;
    };
    Update: {
        Request: Omit<Request, 'body'> & { body: { data: Partial<TypeAttachment> } };
        Response: Response<ApiResponse<TypeAttachment>>;
    };
    Remove: {
        Request: Omit<Request, 'params'> & { params: { fid: string } };
        Response: Response<ApiResponse<boolean>>;
    };
}
