/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import * as TypeData from '@modules/user/types/data.d';
import * as TypeApi from '@modules/user/types/api.d';
import type * as TypeModel from '@modules/user/types/model.d';

declare global {
    namespace App.ModuleUser {
        export import Data = TypeData;
        export import Api = TypeApi;
        export import Model = TypeModel;
    }
}
