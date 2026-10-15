/**
 *
 * @author dongntd267@gmail.com
 *
 */

export type Data = unknown;
export type Metadata = Record<string, unknown>;
export type Param = Record<string, string>;

export type SearchParam<P = Param> = {
    q?: string;
    page?: string;
    skip?: string;
    limit?: string;
} & P;

export type SearchResponse<D = Data, M = Metadata> = {
    data: D;
    metadata: {
        currentItems: number;
        totalItems: number;
        totalPages: number;
        currentPage: number;
    } & M;
};

export type ApiResponse<D = Data, M = Metadata> = {
    message: string;
    data: D;
    metadata: M;
};

export type ApiSearchResponse<D = Data, M = Metadata> = SearchResponse<D, M> & {
    message: string;
};
