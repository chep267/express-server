/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import Pusher from 'pusher';

/** constants */
import { AppEnv } from '@modules/base/constants/env';

export const pusherServer = new Pusher({
    appId: AppEnv.pusher.appId,
    key: AppEnv.pusher.key,
    secret: AppEnv.pusher.secret,
    cluster: AppEnv.pusher.cluster,
    useTLS: true
});
