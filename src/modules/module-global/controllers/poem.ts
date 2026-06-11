/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

/** utils */
import { genResponse } from '@module-base/utils/api';
import { poems } from '@module-global/utils/poem';

/** types */
import type { Request, Response } from 'express';

const items = poems.map((poem, index) => {
    const item: App.ModuleGlobal.Data.TypePoemData = {
        id: `${index + 1}`,
        title: 'Thơ chế',
        description: '',
        content: poem,
        author: {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            name: 'Chép nèe',
            phone: faker.phone.number(),
            role: faker.helpers.arrayElement(['admin', 'user']),
            status: faker.helpers.arrayElement(['online', 'offline', 'busy']),
            statusMessage: '',
            blockedUsers: [],
            fcmTokens: [],
            photo: faker.image.avatar(),
            lastActiveAt: faker.date.recent().toISOString(),
            createdAt: faker.date.past().toISOString(),
            updatedAt: faker.date.recent().toISOString()
        },
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString()
    };
    return item;
});

const gets = (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json(genResponse({ data: items }));
};
export const poemController = {
    gets
};
