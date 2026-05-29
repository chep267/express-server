/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { TypeThread, TypeMessage } from '@module-messenger/types/data.d';

export interface GetMessages {
    Payload: { tid?: string; q?: string; page?: string; limit?: string };
    Response: Promise<{
        items: TypeMessage[];
        currentItems: number;
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }>;
}

/** threads */
export interface GetThreads {
    Payload: { uid?: string; q?: string; page?: string; limit?: string };
    Response: Promise<{
        items: TypeThread[];
        currentItems: number;
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }>;
}

export interface CreateThread {
    Payload: { data: TypeThread };
    Response: Promise<TypeThread>;
}

export interface UpdateThread {
    Payload: { data: TypeMessage };
    Response: Promise<TypeThread | undefined>;
}
