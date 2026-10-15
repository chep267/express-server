/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import * as TypeApi from '@modules/base/types/api.d';

declare global {
    namespace App.ModuleBase {
        export import Api = TypeApi;
    }
}
