/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import path from 'path';
import fs from 'fs';
import https from 'node:https';

/** constant */
import { AppEnv } from '@modules/base/constants/env';

/** utils */
import { connected } from '@modules/base/utils/log';
import app from '@src/index';

const dirname = path.resolve();

const httpsServer = https.createServer(
    {
        key: fs.readFileSync(path.join(dirname, 'cert', 'server.key')),
        cert: fs.readFileSync(path.join(dirname, 'cert', 'server.cert'))
    },
    app
);

httpsServer.listen(AppEnv.appPort, () => {
    console.log(connected(`chep-server https start in: https://${AppEnv.appHost}:${AppEnv.appPort}`));
});
