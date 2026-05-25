/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import * as TypeData from '@module-user/types/data.d';
import * as TypeApi from '@module-user/types/api.d';
import type * as TypeModel from '@module-user/types/model.d';

declare global {
    namespace App.ModuleUser {
        export import Data = TypeData;
        export import Api = TypeApi;
        export import Model = TypeModel;
    }
}
