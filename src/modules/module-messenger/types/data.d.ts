/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
export type MessageType = 'text' | 'image' | 'video' | 'file' | 'audio' | 'sticker' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'received' | 'seen';

export type TypeMessageAttachment = {
    /** URL của file/ảnh/video trên storage (S3, Cloudinary, etc.) */
    url: string;

    /** Tên file gốc (ví dụ: "tai_lieu_hop.pdf") */
    name: string;

    /** Kích thước file tính bằng byte */
    size: number;

    /** Định dạng file (ví dụ: "image/png", "application/pdf") */
    mimeType: string;
};

export type TypeMessage = {
    /** ID duy nhất của tin nhắn */
    mid: string;

    /** ID của cuộc hội thoại chứa tin nhắn này */
    tid: string;

    /** ID của người gửi (tương đương với authorId của bạn nhưng đồng bộ với uid trong TypeThread) */
    uid: string;

    /** Nội dung văn bản thô (Nếu là ảnh/file, trường này có thể dùng làm caption hoặc mô tả) */
    content: string;

    /** Phân loại tin nhắn để phía Client render UI phù hợp (Văn bản, hình ảnh, file, hoặc thông báo hệ thống) */
    type: MessageType;

    /** Danh sách file/ảnh đính kèm (Mảng rỗng nếu type là 'text') */
    attachments: TypeMessageAttachment[];

    /** Trạng thái của tin nhắn (Đồng bộ với status trong lastMessage của Thread) */
    status: MessageStatus;

    /** Thời gian tạo tin nhắn (Timestamp) */
    createdAt: string;

    /** Thời gian cập nhật tin nhắn (Ví dụ: khi user sửa tin nhắn - Timestamp) */
    updatedAt: string;

    /**
     * Tính năng nâng cao: Phản hồi (Reply) một tin nhắn khác.
     * Chỉ lưu các thông tin core để hiển thị nhanh block reply mà không cần gọi lại API.
     */
    replyTo: {
        mid: string;
        uid: string;
        content: string;
        type: MessageType;
    };

    /** Trạng thái tin nhắn này đã bị thu hồi (delete for everyone) chưa */
    isRevoke: boolean;
    isDeleted: boolean;

    /** Trạng thái tin nhắn được ghim trong hội thoại */
    isPinned: boolean;

    /**
     * Metadata bổ sung cho các trường hợp đặc biệt
     * (Ví dụ: kích thước thumbnail ảnh, danh sách uids đã thả emoji reaction: { "👍": ["uid1", "uid2"] })
     */
    metadata?: Record<string, unknown>;
};

export type TypeThread = {
    /** ID duy nhất của cuộc hội thoại */
    tid: string;

    /** Tên nhóm (nếu là chat 1-1, trường này có thể null và lấy name của đối phương) */
    name: string;

    /** Ảnh đại diện nhóm (nếu null, dùng avatar của đối phương) */
    avatar: string;

    /** Danh sách ID thành viên trong thread (để query/filter nhanh) */
    uids: string[];

    /** Tin nhắn cuối cùng để hiển thị ở danh sách bên ngoài */
    lastMessage: {
        mid: string; // ID tin nhắn
        uid: string; // ID người gửi
        content: string; // Nội dung text hoặc mô tả (ví dụ: "Đã gửi một ảnh")
        createdAt: string; // Thời gian gửi (timestamp)
        status: 'sending' | 'sent' | 'received' | 'seen';
    };

    /** Số tin nhắn chưa đọc của user hiện tại trong thread này */
    unreadCount: {
        uid: string;
        count: number;
    }[];

    /** Metadata bổ sung (ví dụ: thread có bị mute không, có phải là group không) */
    isGroup: boolean;
    updatedAt: string;
};
