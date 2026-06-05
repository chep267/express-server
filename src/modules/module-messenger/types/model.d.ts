/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { Model } from 'mongoose';
import type { SearchParam, SearchResponse } from '@module-base/types/api';
import type { TypeThread, TypeMessage, TypeAttachment } from '@module-messenger/types/data.d';

/** messages */
export interface Messages {
    Gets: {
        Payload: SearchParam<{ tid: string }>;
        Return: Promise<SearchResponse<TypeMessage[]>>;
    };
    Create: {
        Payload: { data: Partial<TypeMessage> };
        Return: Promise<TypeMessage>;
    };
    Update: {
        Payload: { data: Partial<TypeMessage> };
        Return: Promise<TypeMessage | null>;
    };
}

interface MessageModel extends Model<TypeMessage> {
    gets(payload: Messages['Gets']['Payload']): Messages['Gets']['Return'];
    create(payload: Messages['Create']['Payload']): Messages['Create']['Return'];
    update(payload: Messages['Update']['Payload']): Messages['Update']['Return'];
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/** threads */
export interface Threads {
    Gets: {
        Payload: SearchParam<{ uid: string }>;
        Return: Promise<SearchResponse<TypeThread[]>>;
    };
    Create: {
        Payload: { data: Partial<TypeThread> };
        Return: Promise<TypeThread>;
    };
    Update: {
        Payload: { data: TypeMessage };
        Return: Promise<TypeThread | null>;
    };
}

interface ThreadModel extends Model<TypeThread> {
    gets(payload: Threads['Gets']['Payload']): Threads['Gets']['Return'];
    create(payload: Threads['Create']['Payload']): Threads['Create']['Return'];
    update(payload: Threads['Update']['Payload']): Threads['Update']['Return'];
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/** attachments */
export interface Attachments {
    Gets: {
        Payload: SearchParam<{ uid: string }>;
        Return: Promise<SearchResponse<TypeAttachment[]>>;
    };
    Create: {
        Payload: { data: Partial<TypeAttachment> };
        Return: Promise<TypeAttachment>;
    };
    Update: {
        Payload: { data: TypeAttachment };
        Return: Promise<TypeAttachment | null>;
    };
}

interface AttachmentModel extends Model<TypeAttachment> {
    gets(payload: Attachments['Gets']['Payload']): Attachments['Gets']['Return'];
    create(payload: Attachments['Create']['Payload']): Attachments['Create']['Return'];
    update(payload: Attachments['Update']['Payload']): Attachments['Update']['Return'];
}
