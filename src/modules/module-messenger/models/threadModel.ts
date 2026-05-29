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
    createThread(
        payload: App.ModuleMessenger.Model.CreateThread['Payload']
    ): App.ModuleMessenger.Model.CreateThread['Response'];
    getThreads(payload: App.ModuleMessenger.Model.GetThreads['Payload']): App.ModuleMessenger.Model.GetThreads['Response'];
    getRecentSearch(
        payload: App.ModuleMessenger.Model.GetThreads['Payload']
    ): App.ModuleMessenger.Model.GetThreads['Response'];
    updateThread(
        payload: App.ModuleMessenger.Model.UpdateThread['Payload']
    ): App.ModuleMessenger.Model.UpdateThread['Response'];
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
    createThread: async function (
        payload: App.ModuleMessenger.Model.CreateThread['Payload']
    ): App.ModuleMessenger.Model.CreateThread['Response'] {
        const { uids, isGroup = false, name = '', avatar = '' } = payload.data;

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
        // Tạo chuỗi mã hash duy nhất cho tid nếu bạn không dùng _id mặc định của Mongo
        const newTid = `thread_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;
        const createdAt = new Date().toISOString();

        const newThreadDoc = new this({
            tid: newTid,
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
    getThreads: async function (
        payload: App.ModuleMessenger.Model.GetThreads['Payload']
    ): App.ModuleMessenger.Model.GetThreads['Response'] {
        const { uid, q = '', page = '1', limit = '20' } = payload;
        const searchKey = q.trim();
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
        if (searchKey) {
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
    },
    updateThread: async function (
        payload: App.ModuleMessenger.Model.UpdateThread['Payload']
    ): App.ModuleMessenger.Model.UpdateThread['Response'] {
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

        const now = new Date().toISOString();

        // Sử dụng câu lệnh update nâng cao của MongoDB để tối ưu hiệu năng
        const updatedThread = await this.findOneAndUpdate(
            { tid },
            {
                // 1. Ghi đè tin nhắn cuối cùng và thời gian cập nhật phòng
                $set: {
                    lastMessage: lastMessageData,
                    updatedAt: now
                },
                // 2. Tăng bộ đếm unreadCount lên +1 cho những thành viên KHÁC người gửi
                // Toán tử $[elem] kết hợp với arrayFilters sẽ tìm đúng các phần tử thỏa mãn điều kiện để cộng dồn
                $inc: {
                    'unreadCount.$[elem].count': 1
                }
            },
            {
                // Cấu hình arrayFilters: Chỉ tăng count nếu uid trong mảng khác với uid người gửi tin nhắn
                arrayFilters: [{ 'elem.uid': { $ne: message.uid } }],
                new: true, // Trả về dữ liệu Thread sau khi đã cập nhật xong xuôi
                versionKey: false
            }
        ).exec();

        return updatedThread?.toObject({ versionKey: false });
    }
};

export const ThreadModel = model<App.ModuleMessenger.Data.TypeThread, TypeThreadModel>('Threads', ThreadSchema);
