/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** types */
import type { Model } from 'mongoose';
import type { SearchParam, SearchResponse } from '@module-base/types/api';
import type { TypeThread, TypeMessage, TypeAttachment } from '@module-messenger/types/data.d';

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/** threads */
export interface ThreadModelAction {
    Gets: {
        Payload: SearchParam<{ uid: string }>;
        Return: Promise<SearchResponse<TypeThread[]>>;
    };
    Create: {
        Payload: { data: Partial<TypeThread> };
        Return: Promise<TypeThread>;
    };
    Update: {
        Payload: { tid: string; data: Partial<TypeMessage> };
        Return: Promise<TypeThread | null>;
    };
    AddMessage: {
        Payload: { tid: string; mid: string; uid: string };
        Return: Promise<TypeThread | null>;
    };
    Read: {
        Payload: { tid: string; uid: string };
        Return: Promise<TypeThread | null>;
    };
    Remove: {
        Payload: { tid: string };
        Return: Promise<TypeThread | null>;
    };
}

interface ThreadModel extends Model<TypeThread> {
    gets(payload: ThreadModelAction['Gets']['Payload']): ThreadModelAction['Gets']['Return'];
    create(payload: ThreadModelAction['Create']['Payload']): ThreadModelAction['Create']['Return'];
    update(payload: ThreadModelAction['Update']['Payload']): ThreadModelAction['Update']['Return'];
    addMessage(payload: ThreadModelAction['AddMessage']['Payload']): ThreadModelAction['AddMessage']['Return'];
    read(payload: ThreadModelAction['Read']['Payload']): ThreadModelAction['Read']['Return'];
    remove(payload: ThreadModelAction['Remove']['Payload']): ThreadModelAction['Remove']['Return'];
}

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/** messages */
export interface MessageModelAction {
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
    Remove: {
        Payload: { mid: string };
        Return: Promise<TypeMessage | null>;
    };
}

interface MessageModel extends Model<TypeMessage> {
    gets(payload: MessageModelAction['Gets']['Payload']): MessageModelAction['Gets']['Return'];
    create(payload: MessageModelAction['Create']['Payload']): MessageModelAction['Create']['Return'];
    update(payload: MessageModelAction['Update']['Payload']): MessageModelAction['Update']['Return'];
    remove(payload: MessageModelAction['Remove']['Payload']): MessageModelAction['Remove']['Return'];
}

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/** attachments */
export interface AttachmentModelAction {
    Gets: {
        Payload: SearchParam<{ id: string }>;
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
    gets(payload: AttachmentModelAction['Gets']['Payload']): AttachmentModelAction['Gets']['Return'];
    create(payload: AttachmentModelAction['Create']['Payload']): AttachmentModelAction['Create']['Return'];
    update(payload: AttachmentModelAction['Update']['Payload']): AttachmentModelAction['Update']['Return'];
}
