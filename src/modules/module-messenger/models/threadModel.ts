/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { model, Schema } from 'mongoose';

/** constants */
import { MessengerDatabaseKey } from '@module-messenger/constants/key';

/** types */
import type { QueryFilter } from 'mongoose';

const ThreadSchema = new Schema<App.ModuleMessenger.Data.TypeThread, App.ModuleMessenger.Model.ThreadModel>(
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
            type: {
                mid: { type: String, required: true },
                uid: { type: String, required: true },
                content: { type: String, default: '' },
                createdAt: { type: String, default: '' },
                status: {
                    type: String,
                    enum: ['sending', 'sent', 'received', 'seen', 'failed'],
                    default: 'sent'
                }
            },
            default: null
        },
        unreadCounts: {
            type: [
                {
                    uid: { type: String, required: true },
                    count: { type: Number, required: true, default: 0 }
                }
            ],
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
    gets: async function (
        payload: App.ModuleMessenger.Model.Threads['Gets']['Payload']
    ): App.ModuleMessenger.Model.Threads['Gets']['Return'] {
        const { uid, q = '', page = '1', limit = '20' } = payload;
        const searchKey = q.trim();
        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.max(1, Number(limit));
        const skip = (pageNumber - 1) * limitNumber;

        if (!uid) {
            /** no data */
            return { data: [], metadata: { currentPage: 1, currentItems: 0, totalPages: 1, totalItems: 0 } };
        }

        const queryCondition: QueryFilter<App.ModuleMessenger.Data.TypeThread> = {
            uids: uid
        };
        if (searchKey) {
            queryCondition.name = { $regex: searchKey, $options: 'i' };
        }

        const [items, totalItems] = await Promise.all([
            this.find(queryCondition).skip(skip).limit(limitNumber).sort({ updatedAt: -1 }).exec(),
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
        payload: App.ModuleMessenger.Model.Threads['Create']['Payload']
    ): App.ModuleMessenger.Model.Threads['Create']['Return'] {
        const { tid, uids, isGroup = false, name = '', avatar = '' } = payload.data;

        // 1. Kiểm tra tính hợp lệ của dữ liệu đầu vào
        if (!uids || uids.length < 2) {
            throw new Error('Một cuộc hội thoại phải có ít nhất 2 thành viên trở lên.');
        }

        // 2. XỬ LÝ CHAT 1-1 (Tránh tạo trùng phòng chat)
        if (!isGroup && uids.length === 2) {
            // Tìm xem đã có phòng chat nào chứa CHÍNH XÁC và CHỈ CÓ 2 uid này chưa
            const existingThread = await this.findOne({
                isGroup: false,
                uids: { $all: uids, $size: 2 }
            }).exec();

            // Nếu tìm thấy phòng chat 1-1 cũ, trả về luôn chứ không tạo mới
            if (existingThread) {
                return existingThread.toObject({ versionKey: false });
            }
        }

        // 3. TẠO PHÒNG CHAT MỚI (Cho cả Group Chat hoặc Chat 1-1 chưa từng tồn tại)
        const createdAt = new Date().toISOString();

        const newThreadDoc = new this({
            tid,
            name: isGroup ? name.trim() : '', // Chat 1-1 thì để trống tên phòng
            avatar: isGroup ? avatar.trim() : '',
            isGroup,
            uids: uids,
            unreadCounts: uids.map((uid) => ({ uid, count: 0 })),
            lastMessage: null,
            createdAt,
            updatedAt: createdAt
        });

        // Lưu vào Database
        const savedThread = await newThreadDoc.save();
        return savedThread.toObject({ versionKey: false });
    },

    update: async function (
        payload: App.ModuleMessenger.Model.Threads['Update']['Payload']
    ): App.ModuleMessenger.Model.Threads['Update']['Return'] {
        const message = payload.data;
        const tid = message.tid;

        if (!tid) {
            throw new Error('Thiếu thông tin tid hoặc dữ liệu tin nhắn.');
        }

        // Chuẩn hóa format lastMessage khớp với thiết kế TypeThread của bạn
        const lastMessageData: App.ModuleMessenger.Data.TypeThread['lastMessage'] = {
            mid: message.mid,
            uid: message.uid,
            content: message.content,
            createdAt: message.createdAt,
            status: message.status
        };

        // Sử dụng câu lệnh update nâng cao của MongoDB để tối ưu hiệu năng
        const updatedThread = await this.findOneAndUpdate(
            { tid },
            {
                // 1. Ghi đè tin nhắn cuối cùng và thời gian cập nhật phòng
                $set: {
                    lastMessage: lastMessageData,
                    updatedAt: new Date().toISOString()
                },
                // 2. Tăng bộ đếm unreadCounts lên +1 cho những thành viên KHÁC người gửi
                // Toán tử $[elem] kết hợp với arrayFilters sẽ tìm đúng các phần tử thỏa mãn điều kiện để cộng dồn
                $inc: {
                    'unreadCounts.$[elem].count': 1
                }
            },
            {
                // Cấu hình arrayFilters: Chỉ tăng count nếu uid trong mảng khác với uid người gửi tin nhắn
                arrayFilters: [{ 'elem.uid': { $ne: message.uid } }],
                returnDocument: 'after',
                versionKey: false
            }
        ).exec();
        return updatedThread?.toObject({ versionKey: false }) ?? null;
    }
};

export const ThreadModel = model<App.ModuleMessenger.Data.TypeThread, App.ModuleMessenger.Model.ThreadModel>(
    MessengerDatabaseKey.threads,
    ThreadSchema
);
