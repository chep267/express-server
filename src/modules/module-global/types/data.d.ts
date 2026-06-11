/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { TypeUser } from '@module-user/types/data.d';

export type TypePoemData = {
    id: string;
    title: string;
    description: string;
    content: string;
    author: TypeUser;
    createdAt: string;
    updatedAt: string;
};
