/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';

/** constant */
import { AppEnv } from '@module-base/constants/AppEnv';

/** configs */
import { mongoose as chepDB, dbConfig } from '@module-base/configs/database';

/** routes */
import { rootRouter } from '@module-global/routers';

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

chepDB.connect(dbConfig.uri, { dbName: dbConfig.name, bufferCommands: true }).then();

export default app;
