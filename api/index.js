/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** libs */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const appModule = require('../dist/app.cjs');

export default appModule.default || appModule;
