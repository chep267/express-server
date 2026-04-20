/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** types */
import type { TypeUser } from '@module-user/types/data';

export interface TypeAuth {
    uid: TypeUser['uid'];
    password: string;
    refreshToken: string;
}
