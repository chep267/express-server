/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { Model } from 'mongoose';
import type { TypeAuth } from '@module-auth/types/data.d';

/** auths */
export interface AuthModelAction {
    Get: {
        Payload: { id: TypeAuth['id'] };
        Return: Promise<TypeAuth | null>;
    };
    GetToken: {
        Payload: { id: TypeAuth['id'] };
        Return: Promise<TypeAuth['refreshToken'] | null>;
    };
    Create: {
        Payload: { id: TypeAuth['id']; password: TypeAuth['password'] };
        Return: Promise<TypeAuth>;
    };
    Update: {
        Payload: { id: TypeAuth['id']; data: Partial<TypeAuth> };
        Return: Promise<TypeAuth | null>;
    };
    Delete: {
        Payload: { id: TypeAuth['id'] };
        Return: Promise<boolean>;
    };
}

interface AuthModel extends Model<TypeAuth> {
    get(payload: AuthModelAction['Get']['Payload']): AuthModelAction['Get']['Return'];
    getToken(payload: AuthModelAction['GetToken']['Payload']): AuthModelAction['GetToken']['Return'];
    create(payload: AuthModelAction['Create']['Payload']): AuthModelAction['Create']['Return'];
    update(payload: AuthModelAction['Update']['Payload']): AuthModelAction['Update']['Return'];
    delete(payload: AuthModelAction['Delete']['Payload']): AuthModelAction['Delete']['Return'];
}
