/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { TypeUser } from '@module-user/types/data.d';

export interface GetUser {
    Payload: { uid?: TypeUser['uid']; email?: TypeUser['email'] };
    Response: Promise<TypeUser | null>;
}

export interface GetUsers {
    Payload: { q?: string; page?: string; limit?: string };
    Response: Promise<{
        items: TypeUser[];
        currentItems: number;
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }>;
}

export interface SetUser {
    Payload: { uid: TypeUser['uid']; email: TypeUser['email'] };
    Response: Promise<TypeUser>;
}

export interface UpdateUser {
    Payload: { uid: TypeUser['uid']; data: Partial<Omit<TypeUser, 'uid'>> };
    Response: Promise<TypeUser | null>;
}

export interface DeleteUser {
    Payload: { uid: TypeUser['uid'] };
    Response: Promise<boolean>;
}
