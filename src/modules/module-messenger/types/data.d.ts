/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */

export type MessageType = 'text' | 'image' | 'video' | 'file' | 'audio' | 'sticker' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'received' | 'seen' | 'failed';

export type TypeAttachment = {
    id: string;
    tid: string;
    uid: string;
    url: string;
    fileType: 'image' | 'video' | 'file';
    fileName: string;
    fileSize: number;
    createdAt: string;
    updatedAt: string;
};

export type TypeMessage = {
    id: string;
    tid: string;
    uid: string;
    type: MessageType;
    content: string;
    attachments: TypeAttachment[];
    status: MessageStatus;
    createdAt: string;
    updatedAt: string;
    metadata: {
        replyTo: mid;
        isRevoked: boolean;
        isDeleted: boolean;
        isPinned: boolean;
    } & Record<string, unknown>;
};

export type TypeThread = {
    id: string;
    name: string;
    avatar: string;
    uids: string[];
    unreads: {
        uid: string;
        count: number;
    }[];
    createdAt: string;
    updatedAt: string;
    metadata: {
        isGroup: boolean;
        isMuted: boolean;
        isPinned: boolean;
        lastMessageId: string;
    } & Record<string, unknown>;
};
