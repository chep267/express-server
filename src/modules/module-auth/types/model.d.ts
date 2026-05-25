/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { TypeUser } from '@module-user/types/data.d';

export interface GetAuth {
    Payload: { uid: TypeUser['uid'] };
    Response: Promise<TypeAuth | null>;
}

export interface SetAuth {
    Payload: { uid: TypeUser['uid']; password: string };
    Response: Promise<TypeAuth>;
}

export interface UpdateAuth {
    Payload: { uid: TypeUser['uid']; data: Partial<Omit<TypeAuth, 'uid'>> };
    Response: Promise<TypeAuth>;
}

export interface DeleteAuth {
    Payload: { uid: TypeUser['uid'] };
    Response: Promise<boolean>;
}

export interface GetRefreshToken {
    Payload: { uid: TypeUser['uid'] };
    Response: Promise<TypeAuth['refreshToken'] | null>;
}
