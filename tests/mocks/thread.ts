/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { faker } from '@faker-js/faker';

export function generateMockThread(num: number = 30): App.ModuleMessenger.Data.TypeThread[] {
    return Array.from({ length: num })
        .map(() => ({
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            avatar: faker.image.avatar(),
            uids: [faker.string.uuid(), faker.string.uuid()],
            unreads: [
                {
                    uid: faker.string.uuid(),
                    count: faker.number.int({ min: 0, max: 10 })
                }
            ],
            createdAt: faker.date.past().toISOString(),
            updatedAt: faker.date.recent().toISOString(),
            metadata: {
                isGroup: true,
                isMuted: faker.datatype.boolean(),
                isPinned: faker.datatype.boolean(),
                lastMessageId: faker.string.uuid()
            }
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

export const mockThreads = generateMockThread(30);
