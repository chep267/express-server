/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { model, Schema } from 'mongoose';

/** constants */
import { UserDatabaseKey } from '@module-user/constants/key';
import { MessengerDatabaseKey } from '@module-messenger/constants/key';

/** types */
import type { QueryFilter } from 'mongoose';

const ThreadSchema = new Schema<App.ModuleMessenger.Data.TypeThread, App.ModuleMessenger.Model.ThreadModel>(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: ''
        },
        uids: {
            type: [String],
            default: []
        },
        unreads: {
            type: [
                {
                    _id: false,
                    uid: { type: String, required: true },
                    count: { type: Number, default: 0 }
                }
            ],
            default: []
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {
                isGroup: false,
                isMuted: false,
                isPinned: false,
                lastMessageId: ''
            }
        }
    },
    {
        timestamps: true,
        toObject: {
            versionKey: false
        }
    }
);

ThreadSchema.statics = {
    gets: async function (
        payload: App.ModuleMessenger.Model.ThreadModelAction['Gets']['Payload']
    ): App.ModuleMessenger.Model.ThreadModelAction['Gets']['Return'] {
        const { uid, q = '', page = '1', limit = '20' } = payload;
        const searchKey = q.trim();
        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.max(1, Number(limit));
        const skip = (pageNumber - 1) * limitNumber;
        const queryCondition: QueryFilter<App.ModuleMessenger.Data.TypeThread> = {
            uids: uid
        };

        /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
        /** no searchKey */
        if (!searchKey) {
            const [items, totalItems] = await Promise.all([
                this.find(queryCondition)
                    .select('-_id -__v')
                    .skip(skip)
                    .limit(limitNumber)
                    .sort({
                        updatedAt: -1
                    })
                    .lean()
                    .exec(),
                this.countDocuments(queryCondition).exec()
            ]);
            const totalPages = Math.ceil(totalItems / limitNumber);

            return {
                data: items,
                metadata: {
                    currentPage: pageNumber,
                    currentItems: items.length,
                    totalPages,
                    totalItems
                }
            };
        }

        /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
        /** has searchKey */
        const result = await this.aggregate([
            {
                $match: queryCondition
            },
            {
                $lookup: {
                    from: UserDatabaseKey.users,
                    localField: 'uids',
                    foreignField: 'id',
                    as: UserDatabaseKey.users
                }
            },
            {
                $match: {
                    $or: [
                        { name: { $regex: searchKey, $options: 'i' } },
                        {
                            [UserDatabaseKey.users]: {
                                $elemMatch: {
                                    id: {
                                        $ne: uid
                                    },
                                    name: { $regex: searchKey, $options: 'i' }
                                }
                            }
                        }
                    ]
                }
            },
            {
                $facet: {
                    paginatedResults: [
                        { $sort: { updatedAt: -1 } },
                        { $skip: skip },
                        { $limit: limitNumber },
                        {
                            $project: {
                                _id: 0,
                                __v: 0,
                                [UserDatabaseKey.users]: 0
                            }
                        }
                    ],
                    totalCount: [{ $count: 'total' }]
                }
            }
        ]).exec();

        const items = result[0]?.paginatedResults || [];
        const totalItems = result[0]?.totalCount[0]?.total || 0;
        const totalPages = Math.ceil(totalItems / limitNumber);

        return {
            data: items,
            metadata: {
                currentPage: pageNumber,
                currentItems: items.length,
                totalPages,
                totalItems
            }
        };
    },
    create: async function (
        payload: App.ModuleMessenger.Model.ThreadModelAction['Create']['Payload']
    ): App.ModuleMessenger.Model.ThreadModelAction['Create']['Return'] {
        const { id, uids = [], name = '', avatar = '', metadata } = payload.data;
        const { isGroup } = metadata ?? {};

        /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
        /** existing thread if single thread */
        if (!isGroup) {
            const existingThread = await this.findOne({
                isGroup: false,
                uids: {
                    $all: uids,
                    $size: 2
                }
            })
                .select('-_id -__v')
                .lean()
                .exec();

            if (existingThread) {
                return existingThread;
            }
        }

        /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
        /** new thread */
        const thread = await new this({
            id,
            name: isGroup ? name.trim() : '',
            avatar: isGroup ? avatar.trim() : '',
            uids: uids,
            unreads: uids.map((uid) => ({
                uid,
                count: 0
            })),
            metadata
        }).save();

        return thread.toObject();
    },
    addMessage: async function (
        payload: App.ModuleMessenger.Model.ThreadModelAction['AddMessage']['Payload']
    ): App.ModuleMessenger.Model.ThreadModelAction['AddMessage']['Return'] {
        const { tid, mid, uid } = payload;

        return await this.findOneAndUpdate(
            { id: tid },
            {
                $set: {
                    'metadata.lastMessageId': mid
                },
                $inc: {
                    'unreads.$[elem].count': 1
                }
            },
            {
                arrayFilters: [
                    {
                        'elem.uid': { $ne: uid }
                    }
                ],
                returnDocument: 'after',
                projection: { _id: 0, __v: 0 },
                lean: true
            }
        ).exec();
    },
    read: async function (
        payload: App.ModuleMessenger.Model.ThreadModelAction['Read']['Payload']
    ): App.ModuleMessenger.Model.ThreadModelAction['Read']['Return'] {
        const { tid, uid } = payload;

        return await this.findOneAndUpdate(
            {
                id: tid,
                'unreads.uid': uid
            },
            {
                $set: {
                    'unreads.$[elem].count': 0
                }
            },
            {
                arrayFilters: [
                    {
                        'elem.uid': uid
                    }
                ],
                returnDocument: 'after',
                projection: { _id: 0, __v: 0 },
                lean: true
            }
        ).exec();
    },
    remove: async function (
        payload: App.ModuleMessenger.Model.ThreadModelAction['Remove']['Payload']
    ): App.ModuleMessenger.Model.ThreadModelAction['Remove']['Return'] {
        const { tid } = payload;

        return await this.findOneAndDelete(
            { id: tid },
            {
                projection: { _id: 0, __v: 0 },
                lean: true
            }
        ).exec();
    }
};

export const ThreadModel = model<App.ModuleMessenger.Data.TypeThread, App.ModuleMessenger.Model.ThreadModel>(
    MessengerDatabaseKey.threads,
    ThreadSchema
);
