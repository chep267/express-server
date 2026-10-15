/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type * as TypeData from '@modules/auth/types/data.d';
import type * as TypeApi from '@modules/auth/types/api.d';
import type * as TypeModel from '@modules/auth/types/model.d';

declare global {
    namespace App.ModuleAuth {
        export import Data = TypeData;
        export import Api = TypeApi;
        export import Model = TypeModel;
    }
}
