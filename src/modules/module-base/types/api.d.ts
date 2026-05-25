/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { Request, Response } from 'express';

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
export type CustomResponse<Data = unknown, Metadata = Record<string, unknown>> = Response<ApiResponse<Data, Metadata>>;
