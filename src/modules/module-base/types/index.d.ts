/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { Request } from 'express';

declare global {
    namespace App.ModuleBase {
        namespace Api {
            export type CustomRequestParam<Param extends Record<string, string>> = Request<Param>;
            export type CustomRequestBody<Body extends Record<string, unknown>> = Omit<Request, 'body'> & { body: Body };
        }
    }
}
