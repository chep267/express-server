/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type * as TypeData from '@module-auth/types/data.d';
import type * as TypeApi from '@module-auth/types/api.d';
import type * as TypeModel from '@module-auth/types/model.d';

declare global {
    namespace App.ModuleAuth {
        export import Data = TypeData;
        export import Api = TypeApi;
        export import Model = TypeModel;
    }
}
