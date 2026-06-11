/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { model, Schema } from 'mongoose';

/** models */
import { AttachmentSchema } from '@module-messenger/models/attachment';

/** constants */
import { MessengerDatabaseKey } from '@module-messenger/constants/key';

/** types */
import type { QueryFilter } from 'mongoose';

const MessageSchema = new Schema<App.ModuleMessenger.Data.TypeMessage, App.ModuleMessenger.Model.MessageModel>(
    {
        id: {
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
        type: {
            type: String,
            enum: ['text', 'image', 'video', 'file', 'audio', 'sticker', 'system'],
            default: 'text'
        },
        content: {
            type: String,
            default: ''
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
        metadata: {
            type: Schema.Types.Mixed,
            default: {
                replyTo: {
                    type: String,
                    default: ''
                },
                isRevoked: {
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
                }
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

MessageSchema.statics = {
    gets: async function (
        payload: App.ModuleMessenger.Model.MessageModelAction['Gets']['Payload']
    ): App.ModuleMessenger.Model.MessageModelAction['Gets']['Return'] {
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
            id: tid
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
        payload: App.ModuleMessenger.Model.MessageModelAction['Create']['Payload']
    ): App.ModuleMessenger.Model.MessageModelAction['Create']['Return'] {
        const { data } = payload;

        const message = await new this({
            id: data.id,
            tid: data.tid,
            uid: data.uid,
            type: data.type ?? 'text',
            content: data.content ?? '',
            attachments: data.attachments ?? [],
            metadata: {
                replyTo: data.metadata?.replyTo ?? '',
                isRevoked: data.metadata?.isRevoked ?? false,
                isDeleted: data.metadata?.isDeleted ?? false,
                isPinned: data.metadata?.isPinned ?? false
            }
        }).save();

        return message.toObject();
    },
    remove: async function (
        payload: App.ModuleMessenger.Model.MessageModelAction['Remove']['Payload']
    ): App.ModuleMessenger.Model.MessageModelAction['Remove']['Return'] {
        const { mid } = payload;

        return await this.findOneAndDelete(
            { id: mid },
            {
                projection: { _id: 0, __v: 0 },
                lean: true
            }
        ).exec();
    }
};

export const MessageModel = model<App.ModuleMessenger.Data.TypeMessage, App.ModuleMessenger.Model.MessageModel>(
    MessengerDatabaseKey.messages,
    MessageSchema
);
