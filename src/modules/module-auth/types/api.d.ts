/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { CustomRequestBody, CustomResponse } from '@module-base/types/api.d';
import type { TypeUser } from '@module-user/types/data.d';

/** api signin */
export interface Signin {
    Request: CustomRequestBody<{ email: string; password: string }>;
    Response: CustomResponse<TypeUser, { token?: { exp: string; value: string } }>;
}

/** api sign out */
export interface Signout {
    Request: CustomRequestBody;
    Response: CustomResponse;
}

/** api restart */
export interface Restart {
    Request: CustomRequestBody;
    Response: CustomResponse<TypeUser, { token?: { exp: string; value: string } }>;
}

/** api register */
export interface Register {
    Request: CustomRequestBody<{ email: string; password: string }>;
    Response: CustomResponse;
}

/** api recover */
export interface Recover {
    Request: CustomRequestBody<{ email: string }>;
    Response: CustomResponse;
}
