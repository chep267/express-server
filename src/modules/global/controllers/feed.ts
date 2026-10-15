/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { fakerVI } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

/** utils */
import { genResponse } from '@modules/base/utils/api';

/** types */

const attachments = [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4',
    'https://picsum.photos/800/600?random=5',
    'https://picsum.photos/800/600?random=6',
    'https://picsum.photos/800/600?random=7'
];

const items = attachments.map((_attachment, index, array) => {
    const item: App.ModuleGlobal.Data.TypeFeed = {
        id: `${index + 1}`,
        authorId: fakerVI.string.uuid(),
        content: fakerVI.lorem.paragraphs(fakerVI.number.int({ min: 5, max: 10 })),
        categories: fakerVI.helpers.arrayElements(['top', 'new', 'hot']),
        keywords: fakerVI.helpers.arrayElements(['nodejs', 'reactjs', 'nestjs', 'expressjs', 'mongodb', 'mysql']),
        language: fakerVI.helpers.arrayElement(['vi', 'en']),
        attachments: array.slice(0, index + 1).map((url) => ({
            id: fakerVI.string.uuid(),
            type: 'image',
            size: fakerVI.number.int({ min: 0, max: 10000 }),
            url
        })),
        createdAt: fakerVI.date.past().toISOString(),
        updatedAt: fakerVI.date.recent().toISOString()
    };
    return item;
});

const gets = async (
    _req: App.ModuleGlobal.Api.FeedControllerAction['Gets']['Request'],
    res: App.ModuleGlobal.Api.FeedControllerAction['Gets']['Response']
) => {
    // const { uid, q = '', page = '1', limit = '20' } = req.query;
    // const searchKey = q.trim();
    // const pageNumber = Math.max(1, Number(page));
    // const limitNumber = Math.max(1, Number(limit));
    // const skip = (pageNumber - 1) * limitNumber;
    // const category = req.query.category || 'top';
    // const country = req.query.country || 'vi';

    res.status(StatusCodes.OK).json(
        genResponse({
            data: items
        })
    );
};
export const feedController = {
    gets
};
