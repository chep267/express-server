/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { TypeThread, TypeMessage } from '@module-messenger/types/data.d';

export interface GetMessages {
    Payload: { tid?: string; searchKey?: string; page?: string; limit?: string };
    Response: Promise<{
        items: TypeMessage[];
        currentItems: number;
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }>;
}

export interface GetThreads {
    Payload: { uid?: string; searchKey?: string; page?: string; limit?: string };
    Response: Promise<{
        items: TypeThread[];
        currentItems: number;
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }>;
}
