/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** types */
import type { TypeUser } from '@modules/user/types/data.d';

export interface TypeAuth {
    id: TypeUser['id'];
    password: string;
    refreshToken: string;
}
