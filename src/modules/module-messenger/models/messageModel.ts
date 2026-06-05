/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { model, Schema } from 'mongoose';

/** models */
import { AttachmentSchema } from '@module-messenger/models/attachmentModel';

/** constants */
import { MessengerDatabaseKey } from '@module-messenger/constants/key';

/** types */
import type { QueryFilter } from 'mongoose';

const MessageSchema = new Schema<App.ModuleMessenger.Data.TypeMessage, App.ModuleMessenger.Model.MessageModel>(
    {
        mid: {
            type: String,
            required: true,
            unique: true
        },
        tid: {
            type: String,
            required: true
        },
        uid: {
            type: String,
            required: true
        },
        content: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            enum: ['text', 'image', 'video', 'file', 'audio', 'sticker', 'system'],
            default: 'text'
        },
        attachments: {
            type: [AttachmentSchema],
            default: []
        },
        status: {
            type: String,
            enum: ['sending', 'sent', 'received', 'seen', 'failed'],
            default: 'sent'
        },
        replyTo: {
            type: new Schema(
                {
                    mid: { type: String, required: true },
                    uid: { type: String, required: true },
                    content: { type: String, default: '' },
                    type: { type: String }
                },
                { _id: false }
            ),
            default: null
        },
        isRevoke: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isPinned: {
            type: Boolean,
            default: false
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

MessageSchema.statics = {
    gets: async function (
        payload: App.ModuleMessenger.Model.Messages['Gets']['Payload']
    ): App.ModuleMessenger.Model.Messages['Gets']['Return'] {
        const { tid, q = '', page = '1', limit = '20' } = payload;
        const searchKey = q.trim();
        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.max(1, Number(limit));
        const skip = (pageNumber - 1) * limitNumber;

        if (!tid) {
            /** no data */
            return { data: [], metadata: { currentPage: 1, currentItems: 0, totalPages: 1, totalItems: 0 } };
        }

        const queryCondition: QueryFilter<App.ModuleMessenger.Data.TypeMessage> = {
            tid
        };
        if (searchKey) {
            queryCondition.content = { $regex: searchKey, $options: 'i' };
        }

        const [items, totalItems] = await Promise.all([
            this.find(queryCondition).skip(skip).limit(limitNumber).sort({ createdAt: -1 }).exec(),
            this.countDocuments(queryCondition).exec()
        ]);
        const totalPages = Math.ceil(totalItems / limitNumber);

        return {
            data: items.map((item) => item.toObject({ versionKey: false })),
            metadata: {
                currentPage: pageNumber,
                currentItems: items.length,
                totalPages,
                totalItems
            }
        };
    },
    create: async function (
        payload: App.ModuleMessenger.Model.Messages['Create']['Payload']
    ): App.ModuleMessenger.Model.Messages['Create']['Return'] {
        const { data } = payload;
        const newMessageDoc = new this({
            tid: data.tid,
            uid: data.uid,
            mid: data.mid,
            content: data.content ?? '',
            type: data.type ?? 'text',
            attachments: data.attachments ?? [],
            replyTo: data.replyTo,
            isRevoke: data.isRevoke ?? false,
            isDeleted: data.isDeleted ?? false,
            isPinned: data.isPinned ?? false,
            metadata: data.metadata ?? {}
        });

        // Lưu vào Database
        const savedMessage = await newMessageDoc.save();
        return savedMessage.toObject({ versionKey: false });
    }
};

export const MessageModel = model<App.ModuleMessenger.Data.TypeMessage, App.ModuleMessenger.Model.MessageModel>(
    MessengerDatabaseKey.messages,
    MessageSchema
);
