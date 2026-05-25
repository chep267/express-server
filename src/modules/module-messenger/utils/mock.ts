/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { faker } from '@faker-js/faker';

export const threads = Array.from({ length: 100 }, () => {
    const isGroup = faker.datatype.boolean() || true;
    const memberCount = isGroup ? faker.number.int({ min: 3, max: 10 }) : 2;

    // Tạo danh sách UIDs giả lập
    const uids = Array.from({ length: memberCount }, () => faker.string.uuid());

    return {
        tid: faker.string.uuid(),
        name: isGroup ? faker.company.name() : '',
        avatar: isGroup ? faker.image.avatar() : '',
        uids: uids,
        lastMessage: {
            mid: faker.string.uuid(),
            uid: faker.helpers.arrayElement(uids),
            content: faker.helpers.arrayElement([faker.lorem.sentence(), 'Đã gửi một ảnh', 'Đã gửi một tệp đính kèm', '👍']),
            createdAt: faker.date.recent().getTime(),
            status: faker.helpers.arrayElement(['sending', 'sent', 'received', 'seen'])
        },
        unreadCount: faker.number.int({ min: 0, max: 20 }),
        isGroup: isGroup,
        updatedAt: faker.date.recent().getTime()
    };
});
