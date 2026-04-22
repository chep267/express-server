/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type * as TypeData from '@module-auth/types/data.d';

declare global {
    namespace App.ModuleAuth {
        export import Data = TypeData;
    }
}
