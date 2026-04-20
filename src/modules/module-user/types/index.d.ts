/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import TypeData from '@module-user/types/data.d';

declare global {
    namespace App.ModuleUser {
        export import Data = TypeData;
    }
}
