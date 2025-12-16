/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import path from 'path';
import fs from 'fs';
import express from 'express';
import https from 'https';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';

/** constant */
import { AppEnv } from '@constants/AppEnv';

/** configs */
import { mongoose as chepDB, dbConfig } from '@configs/database';

/** routes */
import { rootRouter } from '@src/routes';

/** utils */
import { connected } from '@utils/log';

const dirname = path.resolve();
const app = express();

app.use(express.static(path.join(dirname, 'public')));
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || AppEnv.appWhiteList.split(';').includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(rootRouter);
https
    .createServer(
        {
            key: fs.readFileSync(path.join(dirname, 'cert', 'server.key')),
            cert: fs.readFileSync(path.join(dirname, 'cert', 'server.cert'))
        },
        app
    )
    .listen(AppEnv.appPort, () => {
        console.log(connected(`chep-server https start in: https://${AppEnv.appHost}:${AppEnv.appPort}`));
    });

chepDB.connect(dbConfig.uri, { dbName: dbConfig.name, bufferCommands: false }).then();

export default app;
