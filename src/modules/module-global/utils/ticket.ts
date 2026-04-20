/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { faker } from '@faker-js/faker';

/** constants */
import { TicketStatus } from '@module-global/constants/ticket';

type TypeTicketData = App.ModuleGlobal.Data.TypeTicketData;

faker.seed(123);

const STATUSES = Object.values(TicketStatus);

export function generateTicket(count: number): TypeTicketData[] {
    return Array.from({ length: count }, (_, index) => ({
        id: `${index + 1}`,
        description: faker.hacker.phrase(),
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

export const createTicket = (data: Partial<TypeTicketData>) => {
    return {
        id: faker.string.uuid(),
        description: faker.hacker.phrase(),
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
