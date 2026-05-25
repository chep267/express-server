/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

export const MessengerApiPath = {
    threads: '/threads',
    thread: '/threads/:tid',
    messages: '/threads/:tid/messages',
    message: 'messages/:mid'
} as const;
