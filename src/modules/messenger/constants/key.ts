/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

export const MessengerDatabaseKey = {
    threads: 'threads',
    messages: 'messages',
    Attachments: 'attachments'
} as const;

export const MessengerSocketEvent = {
    MESSAGE_CREATED: 'MESSAGE_CREATED',
    MESSAGE_REMOVED: 'MESSAGE_REMOVED',

    THREAD_CREATED: 'THREAD_CREATED',

    THREAD_REMOVED: 'THREAD_REMOVED'
} as const;
