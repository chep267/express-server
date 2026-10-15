/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { TypeUser } from '@modules/user/types/data.d';

export type TypePoem = {
    id: string;
    title: string;
    description: string;
    content: string;
    author: TypeUser;
    createdAt: string;
    updatedAt: string;
};

export type Attachment = {
    id: string;
    url?: string | null;
    type?: string | null;
    size?: number | null;
};

export type TypeFeed = {
    id: string;
    authorId: string;
    content?: string | null;
    keywords?: string[] | null;
    categories?: string[] | null;
    attachments?: Attachment[] | null;
    language?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
};
