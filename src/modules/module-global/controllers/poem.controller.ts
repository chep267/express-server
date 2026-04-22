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
            _id: faker.string.uuid(),
            uid: faker.string.uuid(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            role: faker.helpers.arrayElement(['admin', 'user']),
            name: 'Chép nèe',
            photo: faker.image.avatar()
        },
        createdAt: faker.date.past().getTime(),
        updatedAt: null
    };
    return item;
});

const getAll = (_req: Request, res: Response) => {
    const itemIds = items.map((item) => item.id);
    res.status(StatusCodes.OK).json(genResponse({ data: { itemIds, items } }));
};
export const poemController = {
    getAll
};
