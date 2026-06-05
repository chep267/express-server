/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { Request, Response } from 'express';

export type SearchParam<Param extends Record<string, string>> = {
    q?: string;
    page?: string;
    skip?: string;
    limit?: string;
} & Param;

export type SearchResponse<Data, Metadata extends Record<string, unknown>> = {
    data: Data[];
    metadata: {
        currentItems: number;
        totalItems: number;
        totalPages: number;
        currentPage: number;
    } & Metadata;
};

export interface ApiResponse<Data = unknown, Metadata = Record<string, unknown>> {
    message?: string;
    data?: Data;
    metadata?: Metadata;
}

export type CustomRequestParam<Param extends Record<string, string>> = Request<Param>;
export type CustomRequestQuery<Query extends Record<string, string>> = Request<unknown, unknown, unknown, Query>;
export type CustomRequestAll<Param extends Record<string, string>, Query extends Record<string, string>> = Request<
    Param,
    unknown,
    unknown,
    Query
>;
export type CustomRequestBody<Body extends Record<string, unknown>> = Omit<Request, 'body'> & { body: Body };

export type CustomRequest<
    Param extends Record<string, string>,
    Body extends Record<string, unknown>,
    Query extends Record<string, string>
> = Omit<Request<Param, unknown, unknown, Query>, 'body'> & { body: Body };
export type CustomResponse<Data = unknown, Metadata = Record<string, unknown>> = Response<ApiResponse<Data, Metadata>>;
