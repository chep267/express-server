/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { TypeUser } from '@module-user/types/data.d';

export interface TypeTicketData {
    id: string;
    description: string;
    assignee: {
        name: string;
        avatar: string;
    } | null;
    status: TypeTaskStatus;
    createdAt: number;
    updatedAt: number | null;
    deadline: number | null;
}

export type TypePoemData = {
    id: string;
    title: string | null;
    description: string | null;
    content: string | null;
    author: TypeUser | null;
    createdAt: number | null;
    updatedAt: number | null;
};

export type TypeTaskStatus = 'todo' | 'in_progress' | 'done' | 'warning' | 'error';
