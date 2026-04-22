/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type * as TypeData from '@module-global/types/data.d';

declare global {
    namespace App.ModuleGlobal {
        export import Data = TypeData;
    }
}
