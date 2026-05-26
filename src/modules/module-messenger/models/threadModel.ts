/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { model, QueryFilter, Schema } from 'mongoose';

/** types */
import type { Model } from 'mongoose';

interface TypeThreadModel extends Model<App.ModuleMessenger.Data.TypeThread> {
    getThreads(payload: App.ModuleMessenger.Model.GetThreads['Payload']): App.ModuleMessenger.Model.GetThreads['Response'];
    getRecentSearch(
        payload: App.ModuleMessenger.Model.GetThreads['Payload']
    ): App.ModuleMessenger.Model.GetThreads['Response'];
}

const UnreadCountsSchema = new Schema(
    {
        uid: { type: String, required: true },
        count: { type: Number, required: true, default: 0 }
    },
    { _id: false }
);

const LastMessageSchema = new Schema(
    {
        mid: { type: String, required: true },
        uid: { type: String, required: true },
        content: { type: String, default: '' },
        createdAt: { type: Number },
        status: {
            type: String,
            enum: ['sending', 'sent', 'received', 'seen'],
            default: 'sent'
        }
    },
    { _id: false }
);

const ThreadSchema = new Schema<App.ModuleMessenger.Data.TypeThread, TypeThreadModel>(
    {
        tid: {
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
            required: true,
            index: true
        },
        lastMessage: {
            type: LastMessageSchema,
            default: null
        },
        unreadCounts: {
            type: [UnreadCountsSchema],
            default: []
        },
        isGroup: {
            type: Boolean,
            default: false
        },
        updatedAt: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

ThreadSchema.statics = {
    getThreads: async function (
        payload: App.ModuleMessenger.Model.GetThreads['Payload']
    ): App.ModuleMessenger.Model.GetThreads['Response'] {
        const { uid, searchKey = '', page = '1', limit = '20' } = payload;
        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.max(1, Number(limit));
        const skip = (pageNumber - 1) * limitNumber;

        if (!uid) {
            /** no data */
            return { items: [], currentPage: 1, currentItems: 0, totalPages: 1, totalItems: 0 };
        }

        const queryCondition: QueryFilter<App.ModuleMessenger.Data.TypeThread> = {
            uids: uid
        };
        if (searchKey.trim()) {
            queryCondition.name = { $regex: searchKey, $options: 'i' };
        }

        const [items, totalItems] = await Promise.all([
            this.find(queryCondition).skip(skip).limit(limitNumber).sort({ updatedAt: -1 }).exec(),
            this.countDocuments(queryCondition).exec()
        ]);
        const totalPages = Math.ceil(totalItems / limitNumber);

        return {
            items: items.map((item) => item.toObject({ versionKey: false })),
            currentPage: pageNumber,
            currentItems: items.length,
            totalPages,
            totalItems
        };
    }
};

export const ThreadModel = model<App.ModuleMessenger.Data.TypeThread, TypeThreadModel>('Threads', ThreadSchema);
