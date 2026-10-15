/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type * as TypeData from '@modules/messenger/types/data.d';
import type * as TypeApi from '@modules/messenger/types/api.d';
import type * as TypeModel from '@modules/messenger/types/model.d';

declare global {
    namespace App.ModuleMessenger {
        export import Data = TypeData;
        export import Api = TypeApi;
        export import Model = TypeModel;
    }
}
