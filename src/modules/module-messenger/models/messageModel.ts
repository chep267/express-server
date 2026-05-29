/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { model, QueryFilter, Schema } from 'mongoose';

/** types */
import type { Model } from 'mongoose';

interface TypeMessageModel extends Model<App.ModuleMessenger.Data.TypeMessage> {
    getMessages(payload: App.ModuleMessenger.Model.GetMessages['Payload']): App.ModuleMessenger.Model.GetMessages['Response'];
}

const MessageAttachmentSchema = new Schema(
    {
        url: { type: String, required: true },
        type: { type: String, required: true },
        name: { type: String, default: '' },
        size: { type: Number, default: 0 }
    },
    { _id: false }
);

const MessageSchema = new Schema<App.ModuleMessenger.Data.TypeMessage, TypeMessageModel>(
    {
        mid: {
            type: String,
            required: true,
            unique: true // Mỗi tin nhắn có một ID duy nhất toàn hệ thống
        },
        tid: {
            type: String,
            required: true,
            index: true // Tạo index thông thường để khi vào phòng chat, tìm kiếm tin nhắn theo cuộc hội thoại cực nhanh
        },
        uid: {
            type: String,
            required: true,
            index: true // Tạo index để dễ dàng tra cứu lịch sử chat của một user cụ thể
        },
        content: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            enum: ['text', 'image', 'video', 'file', 'system'],
            default: 'text'
        },
        attachments: {
            type: [MessageAttachmentSchema],
            default: []
        },
        status: {
            type: String,
            enum: ['sending', 'sent', 'received', 'seen', 'failed'],
            default: 'sent'
        },
        replyTo: {
            type: {
                mid: { type: String, required: true },
                uid: { type: String, required: true },
                content: { type: String, default: '' },
                type: { type: String, required: true }
            }
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
    getMessages: async function (
        payload: App.ModuleMessenger.Model.GetMessages['Payload']
    ): App.ModuleMessenger.Model.GetMessages['Response'] {
        const { tid, q = '', page = '1', limit = '20' } = payload;
        const searchKey = q.trim();
        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.max(1, Number(limit));
        const skip = (pageNumber - 1) * limitNumber;

        if (!tid) {
            /** no data */
            return { items: [], currentPage: 1, currentItems: 0, totalPages: 1, totalItems: 0 };
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
            items: items.map((item) => item.toObject({ versionKey: false })),
            currentPage: pageNumber,
            currentItems: items.length,
            totalPages,
            totalItems
        };
    }
};

export const MessageModel = model<App.ModuleMessenger.Data.TypeMessage, TypeMessageModel>('Messages', MessageSchema);
