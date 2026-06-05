/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { Model } from 'mongoose';

/** auths */
export interface Auths {
    Get: {
        Payload: { uid: string };
        Return: Promise<TypeAuth | null>;
    };
    GetToken: {
        Payload: { uid: string };
        Return: Promise<string | null>;
    };
    Create: {
        Payload: { uid: string; password: string };
        Return: Promise<TypeAuth>;
    };
    Update: {
        Payload: { data: TypeAuth };
        Return: Promise<TypeMessage | null>;
    };
    Delete: {
        Payload: { uid: string };
        Return: Promise<boolean>;
    };
}

interface AuthModel extends Model<TypeMessage> {
    get(payload: Auths['Get']['Payload']): Auths['Get']['Return'];
    getToken(payload: Auths['GetToken']['Payload']): Auths['GetToken']['Return'];
    create(payload: Auths['Create']['Payload']): Auths['Create']['Return'];
    update(payload: Auths['Update']['Payload']): Auths['Update']['Return'];
    delete(payload: Auths['Delete']['Payload']): Auths['Delete']['Return'];
}
