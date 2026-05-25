/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { v7 as uuidV7 } from 'uuid';

export const genId = (pre: string = '') => `${pre ? `${pre}.` : ''}${uuidV7()}`;
