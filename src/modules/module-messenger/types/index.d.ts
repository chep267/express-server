/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type * as TypeData from '@module-messenger/types/data.d';
import type * as TypeModel from '@module-messenger/types/model.d';
import type * as TypeApi from '@module-messenger/types/api.d';

declare global {
    namespace App.ModuleMessenger {
        export import Data = TypeData;
        export import Api = TypeApi;
        export import Model = TypeModel;
    }
}
