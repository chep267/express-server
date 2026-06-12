/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import path from 'path';
import fs from 'fs';
import https from 'https';

/** constant */
import { AppEnv } from '@module-base/constants/env';

/** utils */
import { connected } from '@module-base/utils/log';
import { initSocket } from '@module-base/utils/socket';
import app from '@src/index';

const dirname = path.resolve();

const httpsServer = https.createServer(
    {
        key: fs.readFileSync(path.join(dirname, 'cert', 'server.key')),
        cert: fs.readFileSync(path.join(dirname, 'cert', 'server.cert'))
    },
    app
);

initSocket(httpsServer);

httpsServer.listen(AppEnv.appPort, () => {
    console.log(connected(`chep-server https start in: https://${AppEnv.appHost}:${AppEnv.appPort}`));
});
