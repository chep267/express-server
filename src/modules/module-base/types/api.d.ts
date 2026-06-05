/**
 *
 * @author dongntd267@gmail.com
 *
 */

export type SearchParam<Param = Record<string, string>> = {
    q?: string;
    page?: string;
    skip?: string;
    limit?: string;
} & Param;

export type SearchResponse<Data = unknown, Metadata = Record<string, unknown>> = {
    data: Data | null;
    metadata: {
        currentItems: number;
        totalItems: number;
        totalPages: number;
        currentPage: number;
    } & Metadata;
};

export interface ApiResponse<Data = unknown, Metadata = Record<string, unknown>> {
    message: string;
    data: Data | null;
    metadata: Metadata;
}

export interface ApiSearchResponse<Data = unknown, Metadata = Record<string, unknown>> extends SearchResponse<
    Data,
    Metadata
> {
    message: string;
}
