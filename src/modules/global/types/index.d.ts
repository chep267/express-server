/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type * as TypeData from '@modules/global/types/data.d';
import type * as TypeApi from '@modules/global/types/api.d';

declare global {
    namespace App.ModuleGlobal {
        export import Data = TypeData;
        export import Api = TypeApi;
    }
}
