/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { Model } from 'mongoose';
import type { SearchParam, SearchResponse } from '@module-base/types/api';
import type { TypeUser } from '@module-user/types/data.d';

/** users */
export interface Users {
    Get: {
        Payload: { uid?: string; email?: string };
        Return: Promise<TypeUser | null>;
    };
    Gets: {
        Payload: SearchParam;
        Return: Promise<SearchResponse<TypeUser>>;
    };
    Check: {
        Payload: { uid?: string; email?: string };
        Return: Promise<boolean>;
    };
    Create: {
        Payload: { uid: string; email: string };
        Return: Promise<TypeUser>;
    };
    Update: {
        Payload: { data: TypeUser };
        Return: Promise<TypeUser | null>;
    };
    Delete: {
        Payload: { uid: string };
        Return: Promise<boolean>;
    };
}

interface UserModel extends Model<TypeUser> {
    get(payload: Users['Get']['Payload']): Users['Get']['Return'];
    gets(payload: Users['Gets']['Payload']): Users['Gets']['Return'];
    check(payload: Users['Check']['Payload']): Users['Check']['Return'];
    create(payload: Users['Create']['Payload']): Users['Create']['Return'];
    update(payload: Users['Update']['Payload']): Users['Update']['Return'];
    delete(payload: Users['Delete']['Payload']): Users['Delete']['Return'];
}
