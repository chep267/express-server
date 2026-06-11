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
export interface UserModelAction {
    Get: {
        Payload: { uid?: TypeUser['id']; email?: TypeUser['email'] };
        Return: Promise<TypeUser | null>;
    };
    Gets: {
        Payload: SearchParam;
        Return: Promise<SearchResponse<TypeUser[]>>;
    };
    Check: {
        Payload: { uid?: TypeUser['id']; email?: TypeUser['email'] };
        Return: Promise<boolean>;
    };
    Create: {
        Payload: { uid: TypeUser['id']; email: TypeUser['email'] };
        Return: Promise<TypeUser>;
    };
    Update: {
        Payload: { uid: TypeUser['id']; data: Partial<TypeUser> };
        Return: Promise<TypeUser | null>;
    };
    Delete: {
        Payload: { uid: TypeUser['id'] };
        Return: Promise<boolean>;
    };
}

interface UserModel extends Model<TypeUser> {
    get(payload: UserModelAction['Get']['Payload']): UserModelAction['Get']['Return'];
    gets(payload: UserModelAction['Gets']['Payload']): UserModelAction['Gets']['Return'];
    check(payload: UserModelAction['Check']['Payload']): UserModelAction['Check']['Return'];
    create(payload: UserModelAction['Create']['Payload']): UserModelAction['Create']['Return'];
    update(payload: UserModelAction['Update']['Payload']): UserModelAction['Update']['Return'];
    delete(payload: UserModelAction['Delete']['Payload']): UserModelAction['Delete']['Return'];
}
