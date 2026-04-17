/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { faker } from '@faker-js/faker';

faker.seed(123); // optional: giữ data cố định

const STATUSES = ['todo', 'in_progress', 'done', 'warning', 'error'] as const;

export interface TypeTaskData {
    id: string;
    title: string | null;
    assignee: {
        name: string | null;
        avatar?: string | null;
    } | null;
    status: (typeof STATUSES)[number] | null;
    createdAt: number | null;
    updatedAt: number | null;
    deadline: number | null;
}

export function generateTasks(count: number): TypeTaskData[] {
    return Array.from({ length: count }, (_, index) => ({
        id: `${index + 1}`,
        title: faker.hacker.phrase(),
        assignee: {
            name: faker.person.fullName(),
            avatar: faker.image.avatar()
        },
        status: faker.helpers.arrayElement(STATUSES),
        createdAt: faker.date.past().getTime(),
        updatedAt: null,
        deadline: faker.date.future().getTime()
    }));
}

export const createTicket = (data: Partial<TypeTaskData>) => {
    return {
        id: faker.string.uuid(),
        title: faker.hacker.phrase(),
        assignee: {
            name: faker.person.fullName(),
            avatar: faker.image.avatar()
        },
        status: faker.helpers.arrayElement(STATUSES),
        createdAt: faker.date.past().getTime(),
        updatedAt: null,
        deadline: faker.date.future().getTime(),
        ...data
    };
};
