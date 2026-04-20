/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
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

export type TypeTaskStatus = 'todo' | 'in_progress' | 'done' | 'warning' | 'error';
